const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/UserRoutes"); // ✅ Renamed
const adminRoutes = require("./routes/adminRoutes");

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
app.all("*", (req, res) => {
  res.status(404).json({ message: `Route  ${req.originalUrl} not found` });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
