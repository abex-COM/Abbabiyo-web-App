const User = require("../models/userModel");
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
  try {
    const { name, phoneNumber, password } = req.body;
    let profilePicture = req.user.profilePicture; // Default to existing profile picture

    if (req.file) {
      // If a new profile image is uploaded
      profilePicture = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches the one in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Update user data
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Send WebSocket event after updating user data
    const io = req.app.get("socketio");
    io.to(user._id).emit("userUpdated", user); // Emit the updated user data

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update user error:", err);
    res
      .status(500)
      .json({ message: "Failed to update profile.", error: err.message });
  }
};
exports.deleteUser = async (req, res) => {
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
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
