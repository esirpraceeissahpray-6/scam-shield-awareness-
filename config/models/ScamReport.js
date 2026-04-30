// controllers/reportController.js

const ScamReport = require("../models/ScamReport");

/*
Report Controller

Handles:
- Saving scam reports
- Risk scoring
- Dataset building
*/

exports.submitReport = async (req, res) => {
  try {

    const { message, category, platform, location } = req.body;

    /*
    Improved Risk Scoring
    */

    let riskScore = 0;

    const scamKeywords = [
      "urgent",
      "verify",
      "password",
      "bank",
      "click link",
      "lottery",
      "investment",
      "crypto",
      "loan",
      "winner",
      "account suspended",
      "limited time",
      "send money",
      "confirm identity"
    ];

    if (message) {
      const lowerMessage = message.toLowerCase();

      scamKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          riskScore += 10;
        }
      });
    }

    /*
    Create and Save Report
    */

    const newReport = new ScamReport({
      message,
      category: category || "other",
      platform: platform || "unknown",
      location: location || "unknown",
      riskScore,
      isVerified: false,     // future use
      confidence: 0          // future AI scoring
    });

    await newReport.save();

    /*
    Response
    */

    res.status(201).json({
      success: true,
      message: "Scam report submitted successfully",
      data: {
        riskScore,
        category: newReport.category
      }
    });

  } catch (error) {

    console.error("Report submission error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit scam report"
    });

  }
};
