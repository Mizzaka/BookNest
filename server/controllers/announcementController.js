const Announcement = require("../models/Announcement");


// Create a new announcement
const createAnnouncement = async (req, res, io) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newAnnouncement = await Announcement.create({ title, content });

        // Emit the new announcement event to all connected clients
        io.emit("update-announcement", newAnnouncement);
        console.log("Emitting update-announcement with data:", newAnnouncement);


        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error("Error creating announcement:", error); 
        res.status(500).json({ message: "Error creating announcement", error: error.message });
    }
};

// Get all announcements
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: "Error fetching announcements", error: error.message });
    }
};

// Get a single announcement by ID
const getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ message: "Error fetching announcement", error: error.message });
    }
};

// Update an announcement
const updateAnnouncement = async (req, res, io) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            { title, content },
            { new: true, runValidators: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        
        io.emit("update-announcement", updatedAnnouncement);

        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: "Error updating announcement", error: error.message });
    }
};

// Delete an announcement
const deleteAnnouncement = async (req, res, io) => {
    try {
        const { id } = req.params;
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        // Emit the deletion event to all connected clients
        io.emit("delete-announcement", id);

        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting announcement", error: error.message });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
};
