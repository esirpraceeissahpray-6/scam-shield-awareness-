/**

* Scam Shield AI - Scam Report Controller
* Connects user reports to all intelligence engines
  */

const riskScoring = require("../utils/riskScoring");
const threatNormalizer = require("../utils/threatNormalizer");

const heatmapEngine = require("../engines/heatmapEngine");
const fraudNetworkEngine = require("../engines/fraudNetworkEngine");
const trustScoreEngine = require("../engines/trustScoreEngine");

const scamReportController = async (req, res) => {
try {
const { message, location, userId } = req.body;

```
// 1. Validate input
if (!message || typeof message !== "string") {
  return res.status(400).json({
    success: false,
    message: "Message is required"
  });
}

const safeUser = userId || "anonymous";

// 2. Normalize input (anti-adversarial protection)
const normalized = threatNormalizer(message);

if (!normalized.safeForScoring) {
  return res.status(400).json({
    success: false,
    message: "Suspicious input detected"
  });
}

// 3. Run risk scoring
const analysis = riskScoring(normalized.cleanedMessage);

// 4. Update trust system
trustScoreEngine.registerReport(safeUser);

// 5. Build report object
const report = {
  message: normalized.cleanedMessage,
  originalMessage: message,
  location: location || "unknown",
  riskScore: analysis.riskScore,
  scamType: analysis.level
};

// 6. Store in engines
heatmapEngine.store(report);
fraudNetworkEngine.addReport(report);

// 7. Response
return res.status(201).json({
  success: true,
  report,
  analysis,
  trust: trustScoreEngine.getTrust(safeUser)
});
```

} catch (error) {
console.error("Scam Report Error:", error.message);

```
return res.status(500).json({
  success: false,
  message: "Failed to process report"
});
```

}
};

module.exports = scamReportController;
