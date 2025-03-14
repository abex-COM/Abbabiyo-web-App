const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new admin (only Super Admin can create admins)
const createAdmin = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin user
    const admin = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      profileImage: 'default.png',
    });

    await admin.save();

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update an admin (only Super Admin can update admins)
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { fullName, username, email, password } = req.body;

  try {
    const admin = await User.findById(id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update admin fields
    admin.fullName = fullName || admin.fullName;
    admin.username = username || admin.username;
    admin.email = email || admin.email;

    if (password) {
      // Hash the new password before saving it
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete an admin (only Super Admin can delete admins)
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findByIdAndDelete(id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createAdmin, updateAdmin, deleteAdmin };