// database.js

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scamshield");

        console.log("Database Connected Successfully");

    } catch (error) {

        console.error("Database Connection Failed");

        process.exit(1);
    }
};

module.exports = connectDB;
