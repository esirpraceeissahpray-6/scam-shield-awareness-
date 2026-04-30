// server.js

const express = require("express");
const cors = require("cors");

/*
Import Database
*/
const connectDB = require("./config/database");

/*
Import Routes
*/
const reportRoutes = require("./routes/reportRoutes");
// keep these ONLY if they exist
// const scamRoutes = require("./routes/scamRoutes");
// const checkerRoutes = require("./routes/checkerRoutes");

/*
Import Middleware (optional if exists)
*/
// const errorHandler = require("./middlewares/errorHandler");

const app = express();

/*
Middleware
*/
app.use(cors());
app.use(express.json());

/*
Connect Database
*/
connectDB();

/*
Routes
*/
app.use("/api/reports", reportRoutes);

// Only use these if files exist
// app.use("/api/scams", scamRoutes);
// app.use("/api/check", checkerRoutes);

/*
Test Route
*/
app.get("/", (req, res) => {
  res.send("🚀 Scam Shield Backend Running");
});

/*
Error Middleware (optional)
*/
// app.use(errorHandler);

/*
Server Port
*/
const PORT = process.env.PORT || 5000;

/*
Start Server
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
