const express = require("express");
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

module.exports = (io) => {
  // Create a new announcement (Admin only)
  router.post(
    "/",
    authenticateUser,
    authorizeRole("admin"),
    (req, res) => createAnnouncement(req, res, io)
  );

  // Get all announcements
  router.get("/", getAnnouncements);

  // Get a single announcement by ID
  router.get("/:id", getAnnouncementById);

  // Update an announcement (Admin only)
  router.put(
    "/:id",
    authenticateUser,
    authorizeRole("admin"),
    (req, res) => updateAnnouncement(req, res, io)
  );

  // Delete an announcement (Admin only)
  router.delete(
    "/:id",
    authenticateUser,
    authorizeRole("admin"),
    (req, res) => deleteAnnouncement(req, res, io)
  );

  return router;
};
