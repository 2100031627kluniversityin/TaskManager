const Feedback = require("../models/Feedback");

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Feedback message is required" });
    }

    const feedback = new Feedback({
      userId: req.user.id,
      message,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all feedback (Admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const feedbacks = await Feedback.find().populate("userId", "username");
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
