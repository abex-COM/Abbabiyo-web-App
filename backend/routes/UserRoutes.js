// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserById,
  getAllUsers,
  registerUser,
  deleteUserById,
  updateUser,
} = require("../controllers/userController");
const roleMiddleware = require("../middleware/roleMiddleware");
// Existing routes...

// Register a new user
router.post("/register", registerUser);

// Fetch all users
router.get(
  "/get-all-users",
  roleMiddleware(["admin", "superadmin"]),
  getAllUsers
);

// Fetch a single user by ID
router.get("/get-a-user/:id", getUserById);

// Delete a user by ID
router.delete("/delete/:id", deleteUserById);
router.put(
  "/update-user/:id",
  roleMiddleware(["admin", "superadmin"]),
  updateUser
);
module.exports = router;
