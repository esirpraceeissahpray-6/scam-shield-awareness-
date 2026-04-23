// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import Database
const connectDB = require("./config/database");

// Import Routes
const scamRoutes = require("./routes/scamRoutes");
const checkerRoutes = require("./routes/checkerRoutes");

// Import Middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/scams", scamRoutes);
app.use("/api/check", checkerRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Scam Shield AI Backend Running...");
});

// Error Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
