const Librarian = require("../models/Librarian");
const Branch = require("../models/Branch"); 
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Fetch all librarians

const getAllLibrarians = async (req, res) => {
  try {
    const librarians = await Librarian.find().populate("branchId", "branchName location contactNumber");
    res.status(200).json(librarians);
  } catch (error) {
    res.status(500).json({ message: "Error fetching librarians", error: error.message });
  }
};

// Fetch a single librarian by ID

const getLibrarianById = async (req, res) => {
  try {
    const librarian = await Librarian.findById(req.params.id).populate("branchId", "branchName location contactNumber");
    if (!librarian) {
      return res.status(404).json({ message: "Librarian not found" });
    }
    res.status(200).json(librarian);
  } catch (error) {
    res.status(500).json({ message: "Error fetching librarian", error: error.message });
  }
};



// Create a new librarian
const createLibrarian = async (req, res) => {
  const { firstName, lastName, email, contactNumber, branchName, password } = req.body;

  try {
  
    const branch = await Branch.findOne({ branchName });
    if (!branch) {
      return res.status(404).json({ message: `Branch ${branchName} not found` });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists in the system" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const createdUser = new User({
      fullName: `${firstName} ${lastName}`,
      email,
      passwordHash: hashedPassword,
      phoneNumber: contactNumber,
      role: "librarian", // Assign the role
    });

    await createdUser.save();

    
    const librarian = new Librarian({
      firstName,
      lastName,
      email,
      contactNumber,
      branchId: branch._id,
      branchName: branch.branchName,
      hireDate: new Date(),
      userId: createdUser._id, // Link user ID to the Librarian
    });

    await librarian.save();

    
    branch.librarians.push(librarian._id); // Add the librarian ID to the branch
    await branch.save(); 

    res.status(201).json({ message: "Librarian created successfully", librarian });
  } catch (error) {
    res.status(500).json({ message: "Error creating librarian", error: error.message });
  }
};


// update an existing librarian

const updateLibrarian = async (req, res) => {
  try {
    const updatedLibrarian = await Librarian.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLibrarian) {
      return res.status(404).json({ message: "Librarian not found" });
    }

    res.status(200).json(updatedLibrarian);
  } catch (error) {
    res.status(400).json({ message: "Error updating librarian", error: error.message });
  }
};

// delete a librarian

const deleteLibrarian = async (req, res) => {
  try {
    const librarian = await Librarian.findByIdAndDelete(req.params.id);
    if (!librarian) {
      return res.status(404).json({ message: "Librarian not found" });
    }
    res.status(200).json({ message: "Librarian deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting librarian", error: error.message });
  }
};

module.exports = {
  getAllLibrarians,
  getLibrarianById,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian,
};
