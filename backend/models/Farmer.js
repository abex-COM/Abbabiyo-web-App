// backend/models/Farmer.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // or bcryptjs

const farmerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    farmName: { type: String, required: true },
    location: { type: String, required: true },
    crops: { type: [String], default: [] }, 
    profileImage: { type: String, default: 'default.png' },
  });

// Hash the password before saving the farmer
farmerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next();
});

// Method to compare passwords during login
farmerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Farmer', farmerSchema);