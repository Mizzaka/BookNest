const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  addBookByLibrarian,
  getBooksByBranch, 
  getBookCopiesByBranch
} = require("../controllers/bookController");

const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Route to create a new book 
router.post("/", authenticateUser, authorizeRole("admin"), upload.single("coverImage"), createBook);

// Route for librarian to add books to their branch
router.post("/librarian/add", authenticateUser, authorizeRole("librarian"), upload.single("coverImage"), addBookByLibrarian);

router.get("/librarian/branch", authenticateUser, authorizeRole("librarian"), getBooksByBranch);




//  create a new book
router.post("/",  createBook);

// get all books
router.get("/", getAllBooks);

// get a single book by ID
router.get("/:id", getBookById);

//  update a book by ID
router.put("/:id", authenticateUser, authorizeRole("admin"), upload.single("coverImage"), updateBook);

//  delete a book by ID
router.delete("/:id", deleteBook);

//  fetch book copies by book ID and branch
router.get("/:id/copies", getBookCopiesByBranch);


module.exports = router;
