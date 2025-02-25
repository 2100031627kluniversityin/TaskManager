const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Middleware to check admin access
const adminAuth = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Get all users and their tasks (Admin only)
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    const tasks = await Task.find()
      .populate("assignedTo")
      .sort({ createdAt: -1 }); // Sort tasks newest first

    const usersWithTasks = users.map((user) => ({
      ...user.toObject(),
      tasks: tasks.filter(
        (task) => task.assignedTo?._id.toString() === user._id.toString()
      ),
    }));

    res.json(usersWithTasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});


// Delete a user (Admin only)
router.delete("/user/:id", auth, adminAuth, async (req, res) => {
  try {
    await Task.deleteMany({ assignedTo: req.params.id }); // Delete user’s tasks
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Delete a task (Admin only)
router.delete("/user/:userId/task/:taskId", auth, adminAuth, async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
