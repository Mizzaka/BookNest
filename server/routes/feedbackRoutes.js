const express = require("express");
const {
    createFeedback,
    getAllFeedbacks,
    updateFeedback, 
    deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

// create new feedback
router.post("/", createFeedback);

// get all feedbacks
router.get("/", getAllFeedbacks);

// update feedback by ID
router.put("/:id", updateFeedback); 

// delete feedback by ID
router.delete("/:id", deleteFeedback);

module.exports = router;
