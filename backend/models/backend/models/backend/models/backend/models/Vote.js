const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    scam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scam",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate voting (one vote per user per scam)
voteSchema.index({ scam: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
