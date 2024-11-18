const { config } = require('dotenv');
const jwt = require('jsonwebtoken');
config();

// Middleware for JWT verification
const jwtAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userPayload = decoded; 
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Generate Token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET); 
};

module.exports = { jwtAuthMiddleware, generateToken };