const Branch = require("../models/Branch");

// Fetch all branches
const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate("librarians", "firstName lastName");
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Fetch a single branch by ID
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate("librarians", "firstName lastName");
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new branch

const createBranch = async (req, res) => {
  const { branchName, location, contactNumber, librarians } = req.body;

  try {
    const newBranch = new Branch({
      branchName,
      location,
      contactNumber,
      librarians,
    });

    const savedBranch = await newBranch.save();
    res.status(201).json(savedBranch);
  } catch (error) {
    res.status(400).json({ message: "Error creating branch", error: error.message });
  }
};

// Update branch

const updateBranch = async (req, res) => {
  try {
    const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(400).json({ message: "Error updating branch", error: error.message });
  }
};

// Delete a branch

const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
