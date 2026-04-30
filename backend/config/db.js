// config/database.js

const mongoose = require("mongoose");

/*
Database Connection

Supports:
- Environment variable (production)
- Local fallback (development)
*/

const connectDB = async () => {
  try {

    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scamshield";

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {

    console.error("❌ MongoDB Connection Failed:", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
