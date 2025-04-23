const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "default.png" },
  role: {
    type: String,
    enum: ["superadmin", "admin", "user"],
    default: "admin",
  }, // Add more roles as needed
});

// Hash the password before saving the admin
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next();
});

// Method to compare passwords during login
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// Method to compare passwords during login

module.exports = mongoose.model("Admin", AdminSchema);
