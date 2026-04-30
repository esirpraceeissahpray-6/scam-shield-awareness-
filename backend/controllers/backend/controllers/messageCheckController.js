/**

* Scam Shield AI - Message Check Controller
* Core AI Decision Engine
  */

const calculateRiskScore = require("../utils/riskScoring");

const messageCheckController = async (req, res) => {
try {
const { message, userId } = req.body;

```
// 1. Validate input
if (!message || typeof message !== "string") {
  return res.status(400).json({
    success: false,
    message: "Message is required and must be text"
  });
}

// 2. Run AI Risk Scoring Engine
const analysis = calculateRiskScore(message);

// 3. Build structured response (IMPORTANT for data engine layer)
const result = {
  success: true,
  input: {
    message,
    userId: userId || "anonymous"
  },
  analysis: {
    riskScore: analysis.riskScore,
    riskLevel: analysis.level,
    isSafe: analysis.safe
  },
  metadata: {
    timestamp: new Date().toISOString(),
    engine: "ScamShield-RiskEngine-v1"
  }
};

// 4. (Future hook) → send to heatmap / analytics engine
// Example:
// await HeatmapEngine.store(result);

return res.status(200).json(result);
```

} catch (error) {
console.error("Message Check Error:", error.message);

```
return res.status(500).json({
  success: false,
  message: "AI analysis failed"
});
```

}
};

module.exports = messageCheckController;
