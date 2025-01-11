const express = require("express");
const router = express.Router();
const {
  createBookLog,
  getAllBookLogs,
  getBookLogById,
  updateBookLog,
  deleteBookLog,
} = require("../controllers/bookLogController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

//  issue a book (Create BookLog)
router.post("/", createBookLog);

//  get all book logs
router.get("/",authenticateUser, authorizeRole("librarian"), getAllBookLogs);

//  get a book log by ID
router.get("/:id", getBookLogById);

//  update a book log (status)
router.put("/:id", updateBookLog);

//  delete a book log
router.delete("/:id", deleteBookLog);

module.exports = router;
