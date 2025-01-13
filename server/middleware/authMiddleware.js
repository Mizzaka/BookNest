const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");



const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader); 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Access denied!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("Decoded Token:", decoded); 

    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ message: "Invalid user ID in token" });
    }

    // keyword to create ObjectId instance
    req.user = { ...decoded, id: new mongoose.Types.ObjectId(decoded.id) };
    next();
  } catch (error) {
    console.error("Authentication Error:", error); 
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};



// Middleware for role-based access control
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied! Insufficient permissions." });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
