const express = require("express");
const router = express.Router();
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateAdminProfile,
  registerSuperAdmin,
  getAdminById,
  getAdmins,
} = require("../controllers/adminController");
const upload = require("../middleware/upload");
const authController = require("../controllers/authController");

// Existing routes...
router.post("/login", authController.login);

// Fetch all admins (only Super Admin can access)
router.get("/get-all-admin", getAdmins);
// Create an admin (only Super Admin)
router.post("/create", roleMiddleware("superadmin"), createAdmin);

// Update an admin (only Super Admin)
router.put("/update/:id", roleMiddleware("superadmin"), updateAdmin);

// Delete an admin (only Super Admin)
router.delete("/delete/:id", roleMiddleware("superadmin"), deleteAdmin);
// for developmen only
router.post("/register-superadmin", registerSuperAdmin);

// New route for updating profile
router.put(
  "/update-profile/:id",
  upload.single("profileImage"),
  updateAdminProfile
);
// New route for fetching a single admin by ID (only Super Admin can access)
router.get("/get-admin/:id", getAdminById);

module.exports = router;
