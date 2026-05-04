/**

* Scam Shield AI - Data Labeling Engine
* Converts raw reports into AI training labels
  */

class DataLabelingEngine {
/**

* Assign label based on risk score
  */
  assignLabel(riskScore) {
  if (riskScore >= 70) return "SCAM";
  if (riskScore >= 40) return "SUSPICIOUS";
  return "SAFE";
  }

/**

* Assign confidence score
  */
  calculateConfidence(riskScore, trustScore) {
  // Normalize trust score (0–1)
  const trustFactor = trustScore / 100;

```
// Normalize risk score (0–1)
```

```
const riskFactor = riskScore / 100;

// Combine both
const confidence = (riskFactor * 0.7) + (trustFactor * 0.3);

return Number(confidence.toFixed(2));
```

}

/**

* Assign category (basic MVP logic)
  */
  detectCategory(message) {
  const msg = message.toLowerCase();

```
if (msg.includes("bank") || msg.includes("account")) {
```

```
  return "phishing";
}

if (msg.includes("prize") || msg.includes("won")) {
  return "lottery_scam";
}

if (msg.includes("investment") || msg.includes("crypto")) {
  return "investment_scam";
}

return "general_scam";
```

}

/**

* Main labeling function
  */
  labelData({ message, riskScore, trustScore }) {
  const label = this.assignLabel(riskScore);
  const confidence = this.calculateConfidence(riskScore, trustScore);
  const category = this.detectCategory(message);

```
return {
```

```
  input: message,
  label,
  confidence,
  category,
  metadata: {
    riskScore,
    trustScore,
    timestamp: new Date().toISOString()
  }
};
```

}
}

module.exports = new DataLabelingEngine();
