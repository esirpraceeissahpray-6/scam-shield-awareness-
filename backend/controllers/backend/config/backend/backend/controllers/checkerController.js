// checkerController.js

const keywordEngine = require("../services/keywordEngine");
const riskScoringEngine = require("../services/riskScoringEngine");

exports.checkMessage = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message required"
            });
        }

        // Keyword Detection
        const keywordMatches = keywordEngine.detectKeywords(message);

        // Risk Scoring
        const riskScore = riskScoringEngine.calculateRisk(keywordMatches);

        let riskLevel = "Low";

        if (riskScore > 7) riskLevel = "High";
        else if (riskScore > 4) riskLevel = "Medium";

        res.json({
            success: true,
            riskScore,
            riskLevel,
            keywordMatches
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error analyzing message"
        });

    }
};
