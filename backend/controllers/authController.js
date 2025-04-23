const Admin = require("../models/adminModel"); // Renamed from User to Admin
const jwt = require("jsonwebtoken");

// Register a new admin (default non-superadmin)
// const register = async (req, res) => {
//   const { fullName, username, email, password } = req.body;

//   try {
//     // Check if the admin already exists
//     const existingAdmin = await Admin.findOne({
//       $or: [{ username }, { email }],
//     });
//     if (existingAdmin) {
//       return res
//         .status(400)
//         .json({ message: "Username or email already exists" });
//     }

//     // Create a new admin with a default role (e.g., 'user' or 'admin')
//     const admin = new Admin({
//       fullName,
//       username,
//       email,
//       password,
//       role: "user", // Default role (change to 'admin' if this is for admin registration)
//       profileImage: "default.png",
//     });

//     await admin.save();

//     // Generate a JWT token
//     const token = jwt.sign(
//       { id: admin._id, role: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(201).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" }); // Changed "User not found" to "Admin not found"
    }

    if (!(await admin.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ statutus: "success", token: token, admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { login };
