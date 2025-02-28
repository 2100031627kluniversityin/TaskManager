const express = require("express");
const {
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  login,
  adminLogin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/admin-login", adminLogin);

module.exports = router;
