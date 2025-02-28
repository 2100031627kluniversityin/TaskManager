const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }, 
  verificationToken: { type: String }, 
  verificationTokenExpiresAt: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
