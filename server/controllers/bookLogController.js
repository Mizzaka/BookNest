const BookLog = require("../models/BookLog");
const Book = require("../models/Book");
const User = require("../models/User");
const Librarian = require('../models/Librarian');

// Issue a book to a user 

const createBookLog = async (req, res) => {
  const { userId, bookCopyId, dueDate } = req.body;

  try {
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

 
    const book = await Book.findOne({ "bookCopies._id": bookCopyId });
    if (!book) return res.status(404).json({ message: "Book copy not found" });

    const bookCopy = book.bookCopies.id(bookCopyId);
    if (!bookCopy || bookCopy.status !== "available") {
      return res.status(400).json({ message: "Book copy is not available for issuing" });
    }

    
    const bookLog = new BookLog({
      userId,
      bookCopyId,
      dueDate,
    });

    
    bookCopy.status = "issued";
    bookCopy.currentHolder = userId; 
    await book.save();

   
    const savedBookLog = await bookLog.save();
    res.status(201).json(savedBookLog);
  } catch (error) {
    res.status(500).json({ message: "Error issuing book", error: error.message });
  }
};

//  Get all book logs 

const getAllBookLogs = async (req, res) => {
  try {
    
    const librarian = await Librarian.findOne({ userId: req.user.id });
    if (!librarian) {
      return res.status(404).json({ message: "Librarian not found" });
    }

    const branchName = librarian.branchName;

    
    const books = await Book.find({ "bookCopies.branch": branchName });

   
    const bookLogs = await BookLog.find({
      bookCopyId: { $in: books.flatMap((book) =>
        book.bookCopies
          .filter((copy) => copy.branch === branchName)
          .map((copy) => copy._id)
      ) },
    })
      .populate("userId", "fullName email") 
      .lean();

    
    const formattedBookLogs = bookLogs.map((log) => {
      const book = books.find((book) =>
        book.bookCopies.some((copy) => copy._id.toString() === log.bookCopyId.toString())
      );
      if (!book) return log;

      const bookCopy = book.bookCopies.find((copy) =>
        copy._id.toString() === log.bookCopyId.toString()
      );
      return {
        ...log,
        book: {
          title: book.title,
          copyNumber: bookCopy ? bookCopy.copyNumber : "Unknown",
        },
      };
    });

    res.status(200).json({
      branch: branchName,
      bookLogs: formattedBookLogs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book logs", error: error.message });
  }
};

  

// Get a book log by ID

const getBookLogById = async (req, res) => {
    try {
      
      const bookLog = await BookLog.findById(req.params.id)
        .populate("userId", "fullName email")
        .lean();
  
      if (!bookLog) {
        return res.status(404).json({ message: "Book log not found" });
      }
  
     
      const book = await Book.findOne({ "bookCopies._id": bookLog.bookCopyId });
      if (book) {
        const bookCopy = book.bookCopies.id(bookLog.bookCopyId);
        if (bookCopy) {
          bookLog.bookCopyId = {
            _id: bookCopy._id,
            copyNumber: bookCopy.copyNumber,
            status: bookCopy.status,
            branch: bookCopy.branch,
          };
        }
      }
  
      res.status(200).json(bookLog);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book log", error: error.message });
    }
  };
  

// Update a book log  status 

const updateBookLog = async (req, res) => {
  const { status, ifDamaged } = req.body;

  try {
    const bookLog = await BookLog.findById(req.params.id);
    if (!bookLog) return res.status(404).json({ message: "Book log not found" });

    const book = await Book.findOne({ "bookCopies._id": bookLog.bookCopyId });
    const bookCopy = book.bookCopies.id(bookLog.bookCopyId);

   
    if (status === "returned") {
      bookLog.returnedAt = Date.now();
      bookCopy.status = "available";
      bookCopy.currentHolder = null; 
    } else if (status === "damaged") {
      bookCopy.status = "damaged";
      bookLog.ifDamaged = ifDamaged; 
    } else if (status === "overdue") {
      bookCopy.status = "overdue";
    }

    bookLog.status = status; 
    await book.save(); 
    const updatedBookLog = await bookLog.save(); 

    res.status(200).json(updatedBookLog);
  } catch (error) {
    res.status(500).json({ message: "Error updating book log", error: error.message });
  }
};

// Delete a book log 

const deleteBookLog = async (req, res) => {
    try {
    
      const bookLog = await BookLog.findByIdAndDelete(req.params.id);
      if (!bookLog) {
        return res.status(404).json({ message: "Book log not found" });
      }
  
     
      const book = await Book.findOne({ "bookCopies._id": bookLog.bookCopyId });
      if (book) {
        const bookCopy = book.bookCopies.id(bookLog.bookCopyId);
        if (bookCopy) {
          bookCopy.status = "available";      // Reset status to "available"
          bookCopy.currentHolder = null;      // Clear currentHolder
          bookCopy.reservedUntil = null;      // Clear reservedUntil
          await book.save();                  // Save changes to Book schema
        }
      }
  
      res.status(200).json({ message: "Book log deleted successfully and book copy reset" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting book log", error: error.message });
    }
  };
  

module.exports = {
  createBookLog,
  getAllBookLogs,
  getBookLogById,
  updateBookLog,
  deleteBookLog,
};
