const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // Adjust based on your model

const fs = require("fs");
const path = require("path");

// Create an admin(non-super)
const createAdmin = async (req, res) => {
  const { fullName, username, email, password, zone, woreda } = req.body;

  try {
    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const admin = new Admin({
      fullName,
      username,
      email,
      password,
      role: "admin",
      zone,
      woreda,
    });

    await admin.save();
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an admin (only Super Admin can delete admins)
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update admin details
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { fullName, username, email, password, zone } = req.body;

  try {
    const admin = await Admin.findById(id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.fullName = fullName || admin.fullName;
    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.zone = zone || admin.zone;

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update admin profile (including profile image)
const updateAdminProfile = async (req, res) => {
  const { id } = req.params;
  const { fullName, username, email, password } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (
      profileImage &&
      admin.profileImage &&
      admin.profileImage !== "default.png"
    ) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        admin.profileImage
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    admin.fullName = fullName || admin.fullName;
    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.profileImage = profileImage || admin.profileImage;
    admin.password = password || admin.password;

    await admin.save();
    res.status(200).json({ message: "Profile updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Register superadmin
const registerSuperAdmin = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // No manual bcrypt hashing here — the pre("save") hook will handle it
    const superadmin = new Admin({
      fullName,
      username,
      email,
      password, // plain password (will be hashed in schema)
      role: "superadmin",
      profileImage: "default.png",
    });

    await superadmin.save();

    res.status(201).json({
      message: "Superadmin created successfully",
      superadmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single admin by ID
const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// routes/userRoutes.js
const getDashboardData = async (req, res) => {
  try {
    let data;
    let farmers; // Or role: "farmer"
    let admins;
    if (req.user.role === "superadmin") {
      farmers = await User.find();
      admins = await Admin.find();
      data = {
        totalFarmers: farmers.length,
        totalAdmins: admins.length,
        // You can add other computations here
      };
    } else {
      farmers = await User.find({ "location.zone": req.user.zone });
      data = {
        totalFarmers: farmers.length,
        totalAdmins: 0,
        // You can add other computations here
      };
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdmins,
  updateAdminProfile,
  registerSuperAdmin,
  getAdminById,
  getDashboardData,
};
