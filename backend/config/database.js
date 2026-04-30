// config/database.js

const mongoose = require("mongoose");

/*
Database Connection

Combines:
- Environment variable support (production-ready)
- Local fallback (development)
*/

const connectDB = async () => {
  try {

    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scamshield";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {

    console.error("❌ Database Connection Failed:", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
