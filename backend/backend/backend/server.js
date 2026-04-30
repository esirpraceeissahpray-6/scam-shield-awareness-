/**

* Scam Shield AI - Backend Server Entry
  */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import DB connection
const connectDB = require("./config/db");

// Import middleware layers
const rateLimiter = require("./middleware/rateLimiter");
const limitMiddleware = require("./middleware/limit");
const captchaValidator = require("./middleware/captchaValidator");

// Import routes
const messageRoutes = require("./routes/messageRoutes");
const scamRoutes = require("./routes/scamRoutes");

// Initialize app
const app = express();

// Connect Database
connectDB();

// --------------------
// GLOBAL MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());

// Hard security layer (fast block)
app.use(rateLimiter);

// AI behavioral security layer
app.use(limitMiddleware);

// --------------------
// ROUTES
// --------------------

// Message Scam Check API
app.use("/api/messages", captchaValidator, messageRoutes);

// Scam Report API
app.use("/api/reports", captchaValidator, scamRoutes);

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
res.json({
success: true,
message: "Scam Shield AI Backend is Running"
});
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
