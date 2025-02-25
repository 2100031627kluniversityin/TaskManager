const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authentication token" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const user = await User.findById(decoded.id);

    

    req.user = { id: decoded.id, isAdmin: decoded.isAdmin || false };
    next();
    
  } catch (err) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: err.message });
  }
};

module.exports = auth;
