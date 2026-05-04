/**

* Scam Shield AI - Scam Report Controller (FULL CONNECTED PIPELINE)
  */

const riskScoring = require("../utils/riskScoring");
const threatNormalizer = require("../utils/threatNormalizer");

const heatmapEngine = require("../engines/heatmapEngine");
const fraudNetworkEngine = require("../engines/fraudNetworkEngine");
const trustScoreEngine = require("../engines/trustScoreEngine");

const dataLabelingEngine = require("../engines/dataLabelingEngine");
const datasetBuilder = require("../engines/datasetBuilder");
const dataQualityEngine = require("../engines/dataQualityEngine");

const scamReportController = async (req, res) => {
try {
const { message, location, userId } = req.body;

```
if (!message) {
  return res.status(400).json({
    success: false,
    message: "Message is required"
  });
}

const user = userId || "anonymous";

// 1. Normalize input
const normalized = threatNormalizer(message);

if (!normalized.safeForScoring) {
  return res.status(400).json({
    success: false,
    message: "Suspicious input detected"
  });
}

// 2. Risk scoring
const analysis = riskScoring(normalized.cleanedMessage);

// 3. Trust system update
const trust = trustScoreEngine.registerReport(user);

// 4. Build base report
const report = {
  message: normalized.cleanedMessage,
  location: location || "unknown",
  riskScore: analysis.riskScore,
  scamType: analysis.level,
  userId: user
};

// 5. Send to intelligence engines
heatmapEngine.store(report);
fraudNetworkEngine.addReport(report);

// 6. DATA ENGINE PIPELINE STARTS HERE

const labeled = dataLabelingEngine.labelData({
  message: report.message,
  riskScore: report.riskScore,
  trustScore: trust.trustScore
});

const isValid = dataQualityEngine.validate(
  labeled,
  trust.trustScore
);

if (isValid) {
  datasetBuilder.addData(labeled);
}

// 7. Response
return res.status(201).json({
  success: true,
  report,
  analysis,
  trust,
  labeledData: labeled
});
```

} catch (error) {
console.error("Controller Error:", error.message);

```
return res.status(500).json({
  success: false,
  message: "Server error"
});
```

}
};

module.exports = scamReportController;
