const mongoose = require("mongoose");

const scamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    scamType: {
      type: String,
      required: true
    },
    location: {
      country: String,
      city: String,
      latitude: Number,
      longitude: Number
    },
    url: {
      type: String
    },
    screenshot: {
      type: String // later can store cloud image URL
    },
    riskScore: {
      type: Number,
      default: 0
    },
    votesUp: {
      type: Number,
      default: 0
    },
    votesDown: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "confirmed", "resolved", "flagged"],
      default: "active"
    },
    flaggedCount: {
      type: Number,
      default: 0
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scam", scamSchema);
