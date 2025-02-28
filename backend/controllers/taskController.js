const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    const parsedDeadline = deadline ? new Date(deadline) : null;

    const task = new Task({
      title,
      description,
      deadline: parsedDeadline,
      priority,
      assignedTo: req.user.id,
    });

    await task.save();

    const tasks = await Task.find({ assignedTo: req.user.id }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    res.status(201).send(tasks);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { assignedTo: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query).sort({ updatedAt: -1 });
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.id },
      req.body,
      { new: true, timestamps: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (completed !== undefined) {
      task.completed = completed;
      await task.save();
    }

    const tasks = await Task.find({ assignedTo: req.user.id }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};
