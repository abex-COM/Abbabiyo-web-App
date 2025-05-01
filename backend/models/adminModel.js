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
  },

  // 👇 This is what you need
  zone: {
    type: String,
    required: [
      function () {
        return this.role === "admin"; // Only required for 'admin'
      },
      "zone is required for admin",
    ],
  },
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
});

// Hash the password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
