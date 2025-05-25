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
  getDashboardData,
  getAllWoredas,
  downloadReport,
} = require("../controllers/adminController");
const upload = require("../middleware/upload");
const authController = require("../controllers/authController");
const { getFramersperZone } = require("../controllers/userController");

// Existing routes...
router.post("/login", authController.login);

// Fetch all admins (only Super Admin can access)
router.get("/get-all-admin", roleMiddleware("superadmin"), getAdmins);
// Create an admin (only Super Admin)
router.post("/create", roleMiddleware("superadmin"), createAdmin);

// Update an admin (only Super Admin)
router.put("/update/:id", roleMiddleware("superadmin"), updateAdmin);

// Delete an admin (only Super Admin)
router.delete("/delete/:id", roleMiddleware("superadmin"), deleteAdmin);
// for developmen only
router.post("/register-superadmin", registerSuperAdmin);
router.get(
  "/dashboard-data",
  roleMiddleware(["admin", "superadmin"]),
  getDashboardData
);
// New route for updating profile
router.put(
  "/update-profile/:id",
  upload.single("profileImage"),
  updateAdminProfile
);
// New route for fetching a single admin by ID (only Super Admin can access)
router.get("/get-admin/:id", getAdminById);
router.get(
  "/farmers-per-region",
  roleMiddleware(["admin", "superadmin"]),
  getFramersperZone
);

router.get("/getUsersworedas", getAllWoredas);

// 2. Download report for a woreda (CSV for demo)
router.get("/download-report", downloadReport);

module.exports = router;
