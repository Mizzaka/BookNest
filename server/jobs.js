const cron = require("node-cron");
const Reservation = require("./models/Reservation");
const Book = require("./models/Book");

// Schedule job to run every minute
cron.schedule("0 0 * * *", async () => {
 

  try {
    const now = new Date(new Date().toUTCString()); // Normalize to UTC
    

    // Find reservations that are active and expired
    const expiredReservations = await Reservation.find({
      status: "active",
      expiryDate: { $lt: now }, // Expiry date is in the past
    });

   

    for (const reservation of expiredReservations) {
      

      // Find the book containing the expired book copy
      const book = await Book.findOne({ "bookCopies._id": reservation.bookCopyId });
      if (book) {
        const bookCopy = book.bookCopies.id(reservation.bookCopyId);
        if (bookCopy) {
          bookCopy.status = "available"; // Reset status to available
          bookCopy.currentHolder = null; // Clear current holder
          bookCopy.reservedUntil = null; // Clear reservedUntil
        }
        await book.save();
      }

      // Update reservation status to "cancelled"
      reservation.status = "cancelled";
      await reservation.save();
      
    }

    console.log("Expired reservations checked and updated successfully.");
  } catch (error) {
    console.error("Error checking expired reservations:", error.message);
  }
});
