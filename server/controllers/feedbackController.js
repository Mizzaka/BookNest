const Feedback = require("../models/feedback");

// create new feedback
const createFeedback = async (req, res) => {
    try {
        const { name, feedback } = req.body;

        if (!name || !feedback) {
            return res.status(400).json({ message: "Name and feedback are required" });
        }

        const newFeedback = await Feedback.create({ name, feedback });
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get all feedbacks
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }); 
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// update feedback
const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, feedback } = req.body;

        if (!name || !feedback) {
            return res.status(400).json({ message: "Name and feedback are required" });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { name, feedback },
            { new: true, runValidators: true } 
        );

        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// delete feedback 
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        await Feedback.findByIdAndDelete(id);
        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createFeedback,
    getAllFeedbacks,
    updateFeedback, 
    deleteFeedback,
};
