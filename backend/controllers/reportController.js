// controllers/reportController.js

const ScamReport = require("../models/ScamReport");

/*
Submit Scam Report
*/

exports.submitReport = async (req, res) => {
  try {

    const { message, category, platform, location } = req.body;

    let riskScore = 0;

    if (message) {
      const lower = message.toLowerCase();

      if (lower.includes("urgent")) riskScore += 10;
      if (lower.includes("bank")) riskScore += 10;
      if (lower.includes("password")) riskScore += 10;
      if (lower.includes("click")) riskScore += 10;
    }

    const report = new ScamReport({
      message,
      category: category || "other",
      platform: platform || "unknown",
      location: location || "unknown",
      riskScore
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Report saved",
      riskScore
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error saving report"
    });

  }
};
