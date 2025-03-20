const express = require("express");
const auth = require("../middleware/auth");
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", auth, submitFeedback);

router.get("/", auth, getAllFeedback);

module.exports = router;
