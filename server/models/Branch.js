const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9+-]{7,15}$/, // Simple regex for phone validation
    },
    librarians: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Librarian", 
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Branch", branchSchema);
