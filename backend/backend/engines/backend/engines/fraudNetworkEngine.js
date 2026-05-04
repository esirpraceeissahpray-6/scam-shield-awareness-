/**

* Scam Shield AI - Fraud Network Engine (UPGRADED)
* Detects scam clusters, repeated campaigns, and coordinated activity
  */

class FraudNetworkEngine {
constructor() {
this.reports = [];
this.clusterThreshold = 3;
}

addReport(report) {
const entry = {
id: Date.now(),
location: report.location || "unknown",
message: report.message || "",
riskScore: report.riskScore || 0,
timestamp: Date.now()
};

```
this.reports.push(entry);
return entry;
```

}

/**

* Simple message fingerprint (normalized)
  */
  fingerprint(message) {
  return message
  .toLowerCase()
  .replace(/\s+/g, " ")
  .slice(0, 50);
  }

/**

* Detect clusters by location + time window
  */
  detectLocationClusters() {
  const clusters = {};
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour

```
this.reports.forEach((r) => {
```

```
  if (now - r.timestamp > window) return;

  const key = r.location;

  if (!clusters[key]) {
    clusters[key] = {
      location: key,
      count: 0,
      highRisk: 0
    };
  }

  clusters[key].count++;

  if (r.riskScore >= 70) {
    clusters[key].highRisk++;
  }
});

return Object.values(clusters).filter(
  (c) => c.count >= this.clusterThreshold
);
```

}

/**

* Detect repeated scam patterns
  */
  detectPatternClusters() {
  const patterns = {};

```
this.reports.forEach((r) => {
```

```
  const key = this.fingerprint(r.message);

  if (!patterns[key]) {
    patterns[key] = {
      pattern: key,
      count: 0
    };
  }

  patterns[key].count++;
});

return Object.values(patterns).filter(
  (p) => p.count >= this.clusterThreshold
);
```

}

/**

* Generate full fraud intelligence report
  */
  generateReport() {
  return {
  totalReports: this.reports.length,
  locationClusters: this.detectLocationClusters(),
  patternClusters: this.detectPatternClusters()
  };
  }

clear() {
this.reports = [];
}
}

module.exports = new FraudNetworkEngine();
