/**

* Scam Shield AI - Intelligence Aggregator Engine
* Combines all intelligence engines into one unified output
  */

const heatmapEngine = require("./heatmapEngine");
const fraudNetworkEngine = require("./fraudNetworkEngine");
const trustScoreEngine = require("./trustScoreEngine");

class IntelligenceAggregator {
/**

* Generate full system intelligence snapshot
  */
  generateOverview() {
  return {
  timestamp: new Date().toISOString(),

  heatmap: heatmapEngine.generateHeatmap(),

  fraudClusters: fraudNetworkEngine.generateReport(),

  summary: this.generateSummary()
  };
  }

/**

* Generate system summary metrics
  */
  generateSummary() {
  const fraudReport = fraudNetworkEngine.generateReport();

```
return {
```

```
  totalReports: fraudReport.totalReports,
  totalClusters: fraudReport.locationClusters.length,
  patternClusters: fraudReport.patternClusters.length
};
```

}

/**

* Get trust score for a specific user
  */
  getUserTrust(userId) {
  return trustScoreEngine.getTrust(userId);
  }
  }

module.exports = new IntelligenceAggregator();
