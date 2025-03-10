const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'uploads/'); // Save files in the 'uploads' folder
   },
   filename: (req, file, cb) => {
     const filename = `image-${Date.now()}${path.extname(file.originalname)}`;
     cb(null, filename);
   },
 });

const upload = multer({ storage });

module.exports = upload;