const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/UserRoutes"); // ✅ Renamed
const adminRoutes = require("./routes/adminRoutes");
const mongoose = require("mongoose");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); //  Updated route path
app.use("/api/admin", adminRoutes);
app.get("/api/status", async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

    res.json({
      message: "MongoDB status check",
      status: states[state],
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error checking DB status", error: err.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: `Route  ${req.originalUrl} is  not found` });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
