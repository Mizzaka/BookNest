const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    publishedYear: {
      type: Number,
    },

    publisher: {
      type: String, // New field for publisher
      required: true, // Make this required or not as per your needs
      trim: true,
    },
    description: {
      type: String, // New field for description
      trim: true, // Optionally trim whitespace
    },
    copiesAvailable: {
      type: Number,
      default: 0,
    },
    totalCopies: {
      type: Number,
      default: 0,
    },
    coverImageURL: {
      type: String,
    },
    bookCopies: [
      {
        copyId: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true, 
        },
        copyNumber: {
          type: String, 
          required: true,
        },
        status: {
          type: String,
          enum: ["available", "reserved", "issued"],
          default: "available",
        },
        currentHolder: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User",
          default: null,
        },
        reservedUntil: {
          type: Date,
          default: null,
        },
        branch: {
          type: String, 
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);


bookSchema.methods.updateCopiesAvailable = async function () {
  try {
    
    const reservedOrIssuedCopies = this.bookCopies.filter(
      (copy) => copy.status === "reserved" || copy.status === "issued"
    );
    
   
    this.copiesAvailable = this.totalCopies - reservedOrIssuedCopies.length;

   
    await this.save();
  } catch (error) {
    console.error("Error updating copiesAvailable:", error);
  }
};

module.exports = mongoose.model("Book", bookSchema);
