// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/database");

const scamRoutes = require("./routes/scamRoutes");
const checkerRoutes = require("./routes/checkerRoutes");

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

// Root Test Route
app.get("/", (req, res) => {
    res.send("Scam Shield AI Backend Running...");
});

// Error Middleware
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
