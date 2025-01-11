const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  
} = require("../controllers/userController");

const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// create a new user
router.post("/", createUser);


// get all users
router.get("/",authenticateUser, authorizeRole("librarian"), getAllUsers); // Only librarians can see all users

// get a  user by ID
router.get("/:id",authenticateUser, getUserById); // Any logged-in user can access their data

// update a user by ID
router.put("/:id", updateUser);

// delete a user by ID
router.delete("/:id", deleteUser);

module.exports = router;
