// server.js

/*
Main Server File

Purpose:
Starts the backend server and connects all system components.

This file:
- Connects database
- Enables middleware
- Connects routes
- Starts the server
*/

const express = require("express");

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
Middleware

Allows server to read JSON data
from frontend requests.
*/

app.use(express.json());

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

Used to confirm server works.
*/

app.get("/", (req, res) => {
  res.send("🚀 Scam Shield Backend Running");
});

/*
Server Port
*/

const PORT = 5000;

/*
Start Server
*/

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
