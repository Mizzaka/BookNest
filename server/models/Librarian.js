const mongoose = require("mongoose");

const librarianSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // email validation
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9+-]{7,15}$/, // Simple regex for phone validation
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", 
      required: true,
    },
    branchName: {
      type: String,
      required: true,  
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Librarian", librarianSchema);
