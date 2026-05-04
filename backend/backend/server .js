/*
Scam Shield AI - Main Server File

Purpose:
Starts backend server and connects all system components.

This file:

* Connects database
* Enables middleware
* Connects routes
* Starts the server
  */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/*
Import Database Connection
*/
const connectDatabase = require("./config/database");

/*
Import Routes
*/
const reportRoutes = require("./routes/reportRoutes");

/*
Import Middleware (ONLY if they exist)
*/
const rateLimiter = require("./middleware/rateLimiter");
const limitMiddleware = require("./middleware/limit");
// const captchaValidator = require("./middleware/captchaValidator"); // enable when needed

/*
GLOBAL MIDDLEWARE
*/

// Enable CORS (important for frontend)
app.use(cors());

// Parse JSON body
app.use(express.json());

// Security layers (safe to use globally)
app.use(rateLimiter);
app.use(limitMiddleware);

/*
Connect Database
*/
connectDatabase();

/*
API Routes

All report routes will start with:
/api
*/
app.use("/api", reportRoutes);

/*
Root Test Route
*/
app.get("/", (req, res) => {
res.send("🚀 Scam Shield Backend Running");
});

/*
Server Port
*/
const PORT = process.env.PORT || 5000;

/*
Start Server
*/
app.listen(PORT, () => {
console.log(`✅ Server running on port ${PORT}`);
});
