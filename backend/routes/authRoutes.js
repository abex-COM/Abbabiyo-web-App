const express = require('express');
const { register, login } = require('../controllers/authController');
const upload = require('../middleware/upload');
const path = require('path');

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Upload profile image
router.post('/upload', upload.single('image'), (req, res) => {
   if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
   }
   res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

// Fetch profile image
router.get('/image/:filename', (req, res) => {
   const filename = req.params.filename;
   const filePath = path.join(__dirname, '../uploads', filename);

   res.sendFile(filePath);
});

module.exports = router;