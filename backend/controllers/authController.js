const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../middleware/Email");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    await sendVerificationEmail(user.email, verificationToken);

    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (err) {
    console.error("Error during registration:", err);
    res
      .status(500)
      .json({ message: "Internal server error during registration." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: "✅ Password reset link sent to email" });
  } catch (err) {
    console.error("❌ Error in forgot password:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "✅ Password reset successful" });
  } catch (err) {
    console.error("❌ Error in reset password:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      email,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("Error during email verification:", err);
    res
      .status(500)
      .json({ message: "Internal server error during email verification." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error during login." });
  }
};

const ADMIN_CREDENTIALS = {
  email: "manojkumarmadugula30@gmail.com",
  password: "Manoj@2004",
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== ADMIN_CREDENTIALS.email ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    return res.status(401).send("Unauthorized: Invalid admin credentials");
  }

  const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, isAdmin: true });
};
