const roleMiddleware = (requiredRole) => (req, res, next) => {
  const userRole = req.user?.role; // Assuming the user role is in the JWT payload

  if (userRole === requiredRole || userRole === 'superadmin') {
    next(); // Allow access
  } else {
    res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  }
};

module.exports = roleMiddleware;