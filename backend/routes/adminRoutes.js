const express = require('express');
const router = express.Router();
const User = require('../models/User');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get all admins (only Super Admin)
router.get('/admins', roleMiddleware('superadmin'), async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create an admin (only Super Admin)
router.post('/admins', roleMiddleware('superadmin'), async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const admin = new User({ fullName, username, email, password, role: 'admin' });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete an admin (only Super Admin)
router.delete('/admins/:id', roleMiddleware('superadmin'), async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;