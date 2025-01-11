const Reservation = require("../models/Reservation"); 
const Book = require("../models/Book"); 
const User = require("../models/User"); 
const BookLog = require("../models/BookLog");
const Librarian = require("../models/Librarian");
const mongoose = require('mongoose');

// Create a new reservation

const createReservation = async (req, res) => {
  try {

     
     const userId = req.user.id; 
     const { bookCopyId } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const book = await Book.findOne({ "bookCopies._id": bookCopyId });
    if (!book) {
      return res.status(404).json({ message: "Book copy not found" });
    }

   
    const bookCopy = book.bookCopies.id(bookCopyId);
    if (!bookCopy || bookCopy.status !== "available") {
      return res.status(400).json({ message: "Book copy is not available for reservation" });
    }

   
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    expiryDate.setHours(23, 59, 59, 999);

  
    const reservation = new Reservation({
      userId,
      bookCopyId,
      status: "active",
      reservedAt: Date.now(),
      expiryDate, // calculated expiry date
    });

    
    bookCopy.status = "reserved";
    bookCopy.currentHolder = userId;
    bookCopy.reservedUntil = expiryDate;

    
    await book.save(); 
    
   
    await book.updateCopiesAvailable();

    
    const savedReservation = await reservation.save();

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: "Error creating reservation", error: error.message });
  }
};





// Fetch reservations for a librarian's branch
const getBranchReservations = async (req, res) => {
  try {
  
    const librarian = await Librarian.findOne({ userId: req.user.id });
    if (!librarian) {
      return res.status(404).json({ message: "Librarian not found" });
    }

    const branchName = librarian.branchName;

   
    const books = await Book.find({ "bookCopies.branch": branchName });

    
    const reservations = await Reservation.find({
      bookCopyId: { $in: books.flatMap((book) =>
        book.bookCopies
          .filter((copy) => copy.branch === branchName)
          .map((copy) => copy._id)
      ) },
    })
      .populate("userId", "fullName email") // Populate user details
      .lean();

    
    const formattedReservations = reservations.map((reservation) => {
      const book = books.find(book =>
        book.bookCopies.some(copy => copy._id.toString() === reservation.bookCopyId.toString())
      );
      if (!book) return reservation;

      const bookCopy = book.bookCopies.find(copy =>
        copy._id.toString() === reservation.bookCopyId.toString()
      );
      return {
        ...reservation,
        book: {
          title: book.title,
          copyNumber: bookCopy ? bookCopy.copyNumber : "Unknown",
        },
      };
    });

    res.status(200).json({
      branch: branchName,
      reservations: formattedReservations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching branch reservations", error: error.message });
  }
};



// Get all reservations

const getAllReservations = async (req, res) => {
    try {
     
      const reservations = await Reservation.find()
        .populate("userId", "fullName email") 
        .lean(); 
  
      
      for (let reservation of reservations) {
        const book = await Book.findOne({ "bookCopies._id": reservation.bookCopyId });
        if (book) {
          
          const bookCopy = book.bookCopies.id(reservation.bookCopyId);
          if (bookCopy) {
            reservation.bookCopyId = {
              _id: bookCopy._id,
              copyNumber: bookCopy.copyNumber,
              branch: bookCopy.branch,
              status: bookCopy.status,
            };
          }
        }
      }
  
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reservations", error: error.message });
    }
  };
  
// Get a reservation by ID

const getReservationById = async (req, res) => {
    try {
      
      const reservation = await Reservation.findById(req.params.id)
        .populate("userId", "fullName email")
        .lean(); 
  
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
     
      const book = await Book.findOne({ "bookCopies._id": reservation.bookCopyId });
      if (book) {
        const bookCopy = book.bookCopies.id(reservation.bookCopyId);
        if (bookCopy) {
          reservation.bookCopyId = {
            _id: bookCopy._id,
            copyNumber: bookCopy.copyNumber,
            branch: bookCopy.branch,
            status: bookCopy.status,
          };
        }
      }
  
      res.status(200).json(reservation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reservation", error: error.message });
    }
  };
  

//  Update reservation status

const updateReservationStatus = async (req, res) => {
  const { status } = req.body; 

  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    
    reservation.status = status || reservation.status;

  
    if (status === "cancelled") {
      const book = await Book.findOne({ "bookCopies._id": reservation.bookCopyId });
      if (book) {
        const bookCopy = book.bookCopies.id(reservation.bookCopyId);
        if (bookCopy) bookCopy.status = "available";
        await book.save();
      }
    }

    const updatedReservation = await reservation.save();
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: "Error updating reservation", error: error.message });
  }
};

// Delete a reservation

const deleteReservation = async (req, res) => {
    try {
      
      const reservation = await Reservation.findByIdAndDelete(req.params.id);
  
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
   
      const book = await Book.findOne({ "bookCopies._id": reservation.bookCopyId });
      if (book) {
        const bookCopy = book.bookCopies.id(reservation.bookCopyId);
        if (bookCopy) {
          bookCopy.status = "available";      // Set status back to "available"
          bookCopy.currentHolder = null;      // Clear currentHolder
          bookCopy.reservedUntil = null;      // Clear reservedUntil date
        }
        await book.save(); 
      }
  
      res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting reservation", error: error.message });
    }
  };

  const markAsBorrowed = async (req, res) => {
    const { reservationId } = req.params;
  
    try {
     
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found." });
      }
  
      
      if (reservation.status !== "active") {
        return res.status(400).json({ message: "Only active reservations can be marked as borrowed." });
      }
  
      // Find the book containing the reserved book copy
      const book = await Book.findOne({ "bookCopies._id": reservation.bookCopyId });
      if (!book) {
        return res.status(404).json({ message: "Book copy not found." });
      }
  
      // Locate the specific book copy
      const bookCopy = book.bookCopies.id(reservation.bookCopyId);
      if (!bookCopy) {
        return res.status(404).json({ message: "Book copy details not found." });
      }
  
      // Check if the book copy is issued
      const existingLog = await BookLog.findOne({
        bookCopyId: reservation.bookCopyId,
        status: "issued",
      });
      if (existingLog) {
        return res.status(400).json({ message: "Book copy is already issued." });
      }
  
    
      reservation.status = "borrowed";
      await reservation.save();
  
     
      bookCopy.status = "issued";
      bookCopy.currentHolder = reservation.userId;
      await book.save();
  
      
      const issueDate = new Date();
      const borrowingPeriodDays = process.env.BORROWING_PERIOD_DAYS || 14;
      const dueDate = new Date(issueDate);
      dueDate.setDate(issueDate.getDate() + borrowingPeriodDays);
  
      const bookLog = new BookLog({
        userId: reservation.userId,
        bookCopyId: reservation.bookCopyId,
        issueDate,
        dueDate,
        status: "issued",
      });
  
      await bookLog.save();
  
      res.status(200).json({
        message: "Reservation marked as borrowed successfully.",
        reservation,
        bookLog,
      });
    } catch (error) {
      res.status(500).json({ message: "Error marking as borrowed.", error: error.message });
    }
  };

  // Get reservations by user ID
  const getUserReservations = async (req, res) => {
    try {
      
      const { userId } = req.params;
  
     
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      
      const reservations = await Reservation.find({ userId });
  
      if (reservations.length === 0) {
        return res.status(404).json({ message: "No reservations found for this user" });
      }
  
      
      res.status(200).json(reservations);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  markAsBorrowed,
  getBranchReservations,
  getUserReservations,
  
};
