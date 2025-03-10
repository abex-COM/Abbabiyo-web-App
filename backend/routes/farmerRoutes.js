const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const upload = require('../middleware/upload');

dotenv.config();

// Register a new farmer
router.post('/register', async (req, res) => {
  const { fullName, username, email, password, farmName, location, crops } = req.body;

  try {
    const existingFarmer = await Farmer.findOne({ $or: [{ username }, { email }] });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const farmer = new Farmer({ fullName, username, email, password, farmName, location, crops });
    await farmer.save();

    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login a farmer
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const farmer = await Farmer.findOne({ username });
    if (!farmer || !(await farmer.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch all farmers
router.get('/farmers', async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch a single farmer by ID
router.get('/farmers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json({ farmer });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a farmer by ID
router.put('/farmers/:id', upload.single('profileImage'), async (req, res) => {
  const { id } = req.params;
  const { fullName, username, email, password, farmName, location, crops } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    farmer.fullName = fullName || farmer.fullName;
    farmer.username = username || farmer.username;
    farmer.email = email || farmer.email;
    farmer.farmName = farmName || farmer.farmName;
    farmer.location = location || farmer.location;
    farmer.crops = crops || farmer.crops;
    farmer.profileImage = profileImage || farmer.profileImage;

    if (password) {
      farmer.password = password;
    }

    await farmer.save();
    res.status(200).json({ message: 'Farmer updated successfully', farmer });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a farmer by ID
router.delete('/farmers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const farmer = await Farmer.findByIdAndDelete(id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json({ message: 'Farmer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;