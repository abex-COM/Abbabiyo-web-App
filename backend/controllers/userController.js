const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
exports.registerUser = async (req, resp) => {
  try {
    const { phoneNumber, location } = req.body;
    const { region, zone, woreda } = location;

    const userExist = await User.findOne({ phoneNumber });
    if (userExist) {
      return resp.status(400).json({
        status: "fail",
        message: "phoneNumber already exists, please find another one",
      });
    }

    if (!region || !woreda || !zone) {
      return resp.status(400).json({
        status: "fail",
        message: "Please fill all location fields",
      });
    }

    const newUser = new User(req.body);
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    resp.status(201).json({ status: "success", newUser, token });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0]; // Get the field that caused the duplication
      return resp.status(400).json({
        status: "fail",
        message: `${duplicateField} already exists. Please use a different one.`,
      });
    }
    resp.status(500).json({ status: "fail", err: err.message });
  }
};

// Get profile information (Authenticated User)
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role === "admin") {
      const user = await Farmer.find({ zone: req.user.zone, _id: id });
      res.status(200).json({ user });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Update User function - updated to handle image uploads similar to createPost
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, phoneNumber, location } = req.body;
    const { region, zone, woreda } = location;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (region) user.location.region = region;
    if (woreda) user.location.woreda = woreda;
    if (zone) user.location.zone = zone;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update user error:", err);
    res
      .status(500)
      .json({ message: "Failed to update profile.", error: err.message });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === "admin") {
      users = await User.find({ "location.zone": req.user.zone });
    } else {
      users = await User.find();
    }

    res.status(200).json(users); // directly send array
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// In your Express server
exports.getFramersperZone = async (req, res) => {
  try {
    let result;

    if (req.user.role === "superadmin") {
      result = await User.aggregate([
        {
          $group: {
            _id: "$location.zone",
            farmerCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            region: "$_id",
            Farmers: "$farmerCount",
          },
        },
      ]);
    } else if (req.user.role === "admin") {
      // First, find the admin's woreda
      const admin = await Admin.findById(req.user.id);

      if (!admin) {
        return res.status(400).json({ error: "Admin location not found" });
      }

      // const adminWoreda = admin.zone;

      result = await User.aggregate([
        {
          $match: {
            "location.zone": req.user.zone, // Filter by admin's zone
          },
        },
        {
          $group: {
            _id: "$location.woreda",
            farmerCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            woreda: "$_id",
            Farmers: "$farmerCount",
          },
        },
      ]);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", error: error.message });
  }
};
