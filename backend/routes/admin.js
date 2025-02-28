const express = require("express");
const auth = require("../middleware/auth");
const {
  adminAuth,
  getAllUsersWithTasks,
  deleteUser,
  deleteUserTask,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", auth, adminAuth, getAllUsersWithTasks);
router.delete("/user/:id", auth, adminAuth, deleteUser);
router.delete("/user/:userId/task/:taskId", auth, adminAuth, deleteUserTask);

module.exports = router;
