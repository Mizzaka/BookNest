const express = require("express");
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  markAsBorrowed,
  getBranchReservations,
  getUserReservations,
  
} = require("../controllers/reservationController");

const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// Get reservations for the librarian's branch
router.get("/branch", authenticateUser, authorizeRole("librarian"),getBranchReservations);

// Route to create a new reservation
router.post("/", authenticateUser, createReservation);

// Route to get all reservations
router.get("/", getAllReservations);

// Route to get a reservation by ID
router.get("/:id", getReservationById);

// Route to update reservation status
router.put("/:id", updateReservationStatus);

// Route to delete a reservation
router.delete("/:id", deleteReservation);

// update mark as borrowed
router.put("/:reservationId/borrow", markAsBorrowed);


router.get('/reservations/:userId', getUserReservations);



module.exports = router;
