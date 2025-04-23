const jwt = require("jsonwebtoken");
const roleMiddleware = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    const userRole = decoded.role; // Extract the role from the decoded token

    if (userRole === requiredRole || userRole === "superadmin") {
      req.user = decoded; // Attach the decoded user to the request object
      next(); // Allow access
    } else {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = roleMiddleware;
