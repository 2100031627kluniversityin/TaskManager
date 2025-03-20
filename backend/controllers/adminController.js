const User = require("../models/User");
const Task = require("../models/Task");
const adminAuth = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}; 
const getAllUsersWithTasks = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const tasks = await Task.find()
      .populate("assignedTo")
      .sort({ createdAt: -1 });
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
};
const deleteUser = async (req, res) => {
  try {
    await Task.deleteMany({ assignedTo: req.params.id });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
const deleteUserTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
module.exports = {
  adminAuth,
  getAllUsersWithTasks,
  deleteUser,
  deleteUserTask,
};
