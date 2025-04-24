const Admin = require("../models/adminModel"); // Renamed from User to Admin
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Check if account is locked
    const now = new Date();
    if (admin.lockUntil && admin.lockUntil > now) {
      const remaining = Math.ceil((admin.lockUntil - now) / 60000); // in minutes
      return res.status(403).json({
        message: `Account locked. Try again in ${remaining} minute(s).`,
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      admin.failedAttempts += 1;

      let response = {
        message: "Invalid credentials",
      };

      if (admin.failedAttempts >= 3) {
        admin.lockUntil = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours
        admin.failedAttempts = 0;
        response.message =
          "Too many failed attempts. Account locked for 4 hours.";
      } else {
        const attemptsLeft = 3 - admin.failedAttempts;
        response.trialsLeft = attemptsLeft;
        response.message += `. ${attemptsLeft} trial(s) left.`;
      }

      await admin.save();
      return res.status(400).json(response);
    }

    // Successful login: reset lock info
    admin.failedAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      statutus: "success",
      token,
      admin,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = { login };
