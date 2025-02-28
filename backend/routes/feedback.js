const express = require("express");
const auth = require("../middleware/auth");
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

// Route to submit feedback
router.post("/", auth, submitFeedback);

// Route to get all feedback (Admin only)
router.get("/", auth, getAllFeedback);

module.exports = router;
