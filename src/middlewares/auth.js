const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication token missing or malformed" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token. Authentication failed." });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = checkAuth;
