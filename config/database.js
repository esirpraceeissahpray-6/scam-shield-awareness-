// config/database.js

const mongoose = require("mongoose");

/*
Database Connection Function

Purpose:
Connects the backend server to MongoDB.

This allows:
- Saving scam reports
- Retrieving stored reports
- Managing datasets
*/

const connectDatabase = async () => {
  try {
    // Temporary local MongoDB connection
    // Later we will move this into .env
    const mongoURI = "mongodb://127.0.0.1:27017/scamshield";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    // Exit process if database fails
    process.exit(1);
  }
};

module.exports = connectDatabase;
