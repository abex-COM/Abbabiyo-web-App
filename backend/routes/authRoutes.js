const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload'); // Import multer middleware
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const fs = require('fs'); // Import fs to handle file system operations
const path = require('path'); // Import path to handle file paths

// Existing routes...
router.post('/register', authController.register);
router.post('/login', authController.login);

// New route for updating profile
router.put('/update-profile/:id', upload.single('profileImage'), async (req, res) => {
   const { id } = req.params;
   const { fullName, username, email, password } = req.body;
   const profileImage = req.file ? req.file.filename : null;

   try {
      const user = await User.findById(id);

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // If a new profile image is uploaded, delete the old one (if it exists)
      if (profileImage && user.profileImage && user.profileImage !== 'default.png') {
         const oldImagePath = path.join(__dirname, '..', 'uploads', user.profileImage);
         if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete the old image file
         }
      }

      // Update user fields
      user.fullName = fullName || user.fullName;
      user.username = username || user.username;
      user.email = email || user.email;
      user.profileImage = profileImage || user.profileImage; // Update the profile image field

      if (password) {
         // Hash the new password before saving it
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);
      }

      await user.save();

      res.status(200).json({ message: 'Profile updated successfully', user });
   } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
   }
});

// New route for fetching user data
router.get('/user/:id', async (req, res) => {
   const { id } = req.params;

   try {
      const user = await User.findById(id);

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
   } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
   }
});

module.exports = router;