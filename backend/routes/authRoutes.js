const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload'); // Import multer middleware
const User = require('../models/User');

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

      user.fullName = fullName || user.fullName;
      user.username = username || user.username;
      user.email = email || user.email;
      user.profileImage = profileImage || user.profileImage;

      if (password) {
         user.password = password;
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