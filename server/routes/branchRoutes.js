const express = require("express");
const router = express.Router();
const {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} = require("../controllers/branchController");

const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// GET all branches
router.get("/", getAllBranches);

// GET single branch by ID
router.get("/:id", authenticateUser, authorizeRole("admin"), getBranchById);

// POST a new branch
router.post("/", authenticateUser, authorizeRole("admin"), createBranch);

// PUT an existing branch
router.put("/:id", authenticateUser, authorizeRole("admin"), updateBranch);

// DELETE a branch
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteBranch);

module.exports = router;
