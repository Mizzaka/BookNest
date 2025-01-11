const express = require("express");
const router = express.Router();
const {
  getAllLibrarians,
  getLibrarianById,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian,
  
} = require("../controllers/librarianController");

const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// GET all librarians
router.get("/", authenticateUser, authorizeRole("admin"), getAllLibrarians);

// GET a single librarian by ID
router.get("/:id",authenticateUser, authorizeRole("admin"), getLibrarianById);

// POST a new librarian
router.post("/", authenticateUser, authorizeRole("admin"), createLibrarian); 
// PUT an existing librarian
router.put("/:id",authenticateUser, authorizeRole("admin"), updateLibrarian);

// DELETE: Remove a librarian
router.delete("/:id",authenticateUser, authorizeRole("admin"), deleteLibrarian);


module.exports = router;
