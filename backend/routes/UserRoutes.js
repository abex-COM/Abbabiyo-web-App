// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  deleteUser,
  getUserById,
  getAllUsers,
  registerUser,
} = require("../controllers/userController");
// Existing routes...

// Register a new user
router.post("/register", registerUser);

// Fetch all users
router.get("/get-all-users", getAllUsers);

// Fetch a single user by ID
router.get("/get-a-user/:id", getUserById);

// Delete a user by ID
router.delete("/users/:id", deleteUser);

module.exports = router;
