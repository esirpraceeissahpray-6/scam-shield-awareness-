// controllers/reportController.js

const ScamReport = require("../models/ScamReport");

/*
Report Controller

Purpose:
Handles saving scam reports into the database.

This file enables:
- Collecting scam messages
- Assigning labels
- Building datasets
- Supporting future AI training
*/

exports.submitReport = async (req, res) => {
  try {

    // Extract user-submitted data
    const {
      message,
      category,
      platform,
      location
    } = req.body;

    /*
    Basic Risk Scoring Logic (MVP version)

    This is a simple keyword-based system.
    Later replaced with AI models.
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
      "winner"
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
    Create new scam report
    */

    const newReport = new ScamReport({

      message,

      category: category || "other",

      platform: platform || "unknown",

      location: location || "unknown",

      riskScore

    });

    /*
    Save report to database
    */

    await newReport.save();

    /*
    Return success response
    */

    res.status(201).json({
      success: true,
      message: "Scam report submitted successfully",
      riskScore
    });

  }

  catch (error) {

    console.error("Report submission error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit scam report"
    });

  }
};
