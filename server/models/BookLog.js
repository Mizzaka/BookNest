const mongoose = require("mongoose");

const bookLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    bookCopyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", 
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["issued", "returned", "overdue", "damaged"],
      default: "issued",
    },
    ifDamaged: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("BookLog", bookLogSchema);  
