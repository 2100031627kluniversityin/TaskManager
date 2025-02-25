const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Create a task (protected route)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    // Ensure that deadline is properly parsed
    const parsedDeadline = deadline ? new Date(deadline) : null;

    const task = new Task({
      title,
      description,
      deadline: parsedDeadline,
      priority,
      assignedTo: req.user.id,
    });
    await task.save();

    // Fetch all tasks sorted by latest created/updated time
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    res.status(201).send(tasks); // Return updated task list
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all tasks for the authenticated user with search functionality
router.get("/", auth, async (req, res) => {
  try {
    const { search } = req.query;

    let query = { assignedTo: req.user.id };

    // If there's a search query, filter tasks by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query).sort({ updatedAt: -1 });
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Edit a task (protected route)
router.put("/:id", auth, async (req, res) => {
  try {
    const { completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.id }, // Ensure task belongs to user
      req.body,
      { new: true, timestamps: true } // Update timestamps for sorting
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If task is marked as completed, move it to completed section
    if (completed !== undefined) {
      task.completed = completed;
      await task.save();
    }

    // Fetch updated tasks sorted by latest update
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task (protected route)
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      assignedTo: req.user.id, // Ensure task belongs to user
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;