const Book = require("../models/Book"); 
const Branch = require("../models/Branch");
const Librarian = require("../models/Librarian");

// Create a new book 

const createBook = async (req, res) => {
  try {
    const { title, author, genre, isbn, publishedYear, publisher, description } = req.body;
    let branchData;

    
    if (req.body.branchData) {
      branchData = JSON.parse(req.body.branchData);
    } else {
      return res.status(400).json({ message: "Branch data is required" });
    }

    console.log("Received book data:", req.body);
    console.log("Uploaded file:", req.file);

  
    if (!title || !author || !genre || !isbn || !branchData || !req.file) {
      return res.status(400).json({ message: "All fields, including cover image, are required" });
    }

    const coverImageURL = req.file.location; // S3 file URL 

    
    const bookCopies = [];

    
    for (let i = 0; i < branchData.length; i++) {
      const { branchName, quantity } = branchData[i];

      // Validation
      if (!branchName || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid branch data provided" });
      }

      // Find branch 
      const branch = await Branch.findOne({ branchName });
      if (!branch) {
        return res.status(404).json({ message: `Branch ${branchName} not found` });
      }

      // copies for branch
      for (let j = 1; j <= quantity; j++) {
        bookCopies.push({
          copyNumber: `Copy-${bookCopies.length + 1}`,
          status: "available",
          branch: branch.branchName,
        });
      }
    }

   
    const book = new Book({
      title,
      author,
      genre,
      isbn,
      publishedYear,
      publisher,
      description,
      coverImageURL, 
      totalCopies: bookCopies.length,
      copiesAvailable: bookCopies.length,
      bookCopies,
    });

   
    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: "Error creating book", error: error.message });
  }
};




  // new book for the librarian's branch
  const addBookByLibrarian = async (req, res) => {
    const { title, author, genre, isbn, publishedYear, publisher, description, totalCopies } = req.body;
  
    try {
      
      if (!req.file || !req.file.location) {
        return res.status(400).json({ message: "Cover image is required" });
      }
  
      const coverImageURL = req.file.location; 
  
      
      const librarian = await Librarian.findOne({ userId: req.user.id });
      if (!librarian) {
        return res.status(404).json({ message: "Librarian not found" });
      }
  
      const branchName = librarian.branchName;
  
     
      const bookCopies = [];
      for (let i = 1; i <= totalCopies; i++) {
        bookCopies.push({
          copyNumber: `Copy-${i}`,
          status: "available",
          branch: branchName,
        });
      }
  
     
      const newBook = new Book({
        title,
        author,
        genre,
        isbn,
        publishedYear,
        publisher,
        description,
        coverImageURL,
        totalCopies,
        copiesAvailable: totalCopies,
        bookCopies,
      });
  
    
      const savedBook = await newBook.save();
  
      res.status(201).json({
        message: "Book added successfully to your branch",
        book: savedBook,
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding book", error: error.message });
    }
  };


  // display books from librarian's branch
const getBooksByBranch = async (req, res) => {
  try {
    
    const librarian = await Librarian.findOne({ userId: req.user.id });
    if (!librarian) {
      return res.status(404).json({ message: "Librarian not found" });
    }

    const branchName = librarian.branchName;

   
    const books = await Book.find({ "bookCopies.branch": branchName });

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found for this branch" });
    }

    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};


 

  

// get all books

const getAllBooks = async (req, res) => {
  try {
    // Fetch all books and include the coverImageURL
    const books = await Book.find({}, 'title author genre coverImageURL');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};


// get a single book by ID

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
};

// update a book

const updateBook = async (req, res) => {
  console.log("Update request params:", req.params.id);
  console.log("Update request body:", req.body);

  try {
    const updatedFields = req.body;

    if (req.file) {
      updatedFields.coverImageURL = req.file.location;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(400).json({ message: "Error updating book", error: error.message });
  }
};



// delete a book

const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};



const getBookCopiesByBranch = async (req, res) => {
  try {
    const { id } = req.params; // Book ID
    const { branch } = req.query; // Branch name from query parameter

   
    if (!branch) {
      return res.status(400).json({ message: "Branch name is required" });
    }


    const book = await Book.findById(id).populate('bookCopies'); 
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

   
    const copiesByBranch = book.bookCopies.filter(copy => copy.branch === branch);

    
    if (copiesByBranch.length === 0) {
      return res.status(404).json({ message: `No available copies in this branch` });
    }

   
    res.status(200).json({ copies: copiesByBranch });
  } catch (error) {
    console.error(error);  
    res.status(500).json({ message: "Error fetching book copies", error: error.message });
  }
};



module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  addBookByLibrarian,
  getBooksByBranch, 
  getBookCopiesByBranch
};
