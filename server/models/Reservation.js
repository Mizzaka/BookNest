const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    bookCopyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // References the specific book copy
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "borrowed", "completed", "cancelled"], // Reservation states
      default: "active", // New reservations are active by default
    },
    reservedAt: {
      type: Date,
      default: Date.now, // Reservation creation date
    },
    expiryDate: {
      type: Date, // Date when the reservation expires
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
