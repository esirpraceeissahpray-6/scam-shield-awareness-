/**

* Scam Shield AI - Fraud Network Engine
* Detects scam clusters and coordinated fraud patterns
  */

class FraudNetworkEngine {
constructor() {
this.reports = [];
this.clusterThreshold = 3;
}

/**

* Add scam report into network
  */
  addReport(report) {
  const entry = {
  id: Date.now(),
  location: report.location || "unknown",
  message: report.message || "",
  riskScore: report.riskScore || 0,
  scamType: report.scamType || "unknown",
  timestamp: new Date().toISOString()
  };

```
this.reports.push(entry);
```

```
return entry;
```

}

/**

* Detect clusters by location
  */
  detectLocationClusters() {
  const clusters = {};

```
this.reports.forEach((r) => {
```

```
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

// Return only suspicious clusters
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
  const key = r.message.slice(0, 30); // simple pattern fingerprint

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

* Get full fraud intelligence report
  */
  generateReport() {
  return {
  totalReports: this.reports.length,
  locationClusters: this.detectLocationClusters(),
  patternClusters: this.detectPatternClusters()
  };
  }

/**

* Reset system (admin use)
  */
  clear() {
  this.reports = [];
  }
  }

module.exports = new FraudNetworkEngine();
