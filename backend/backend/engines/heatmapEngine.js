/**

* Scam Shield AI - Heatmap Intelligence Engine
* Converts scam reports into structured global risk data
  */

class HeatmapEngine {
constructor() {
// In-memory store (later replace with DB aggregation)
this.data = [];
}

/**

* Store scam event into intelligence system
  */
  store(report) {
  const entry = {
  id: Date.now(),
  location: report.location || "unknown",
  riskScore: report.riskScore || 0,
  scamType: report.scamType || "unknown",
  timestamp: new Date().toISOString()
  };

```
this.data.push(entry);
```

```
return entry;
```

}

/**

* Generate heatmap summary (for frontend)
  */
  generateHeatmap() {
  const map = {};

```
this.data.forEach((item) => {
```

```
  const key = item.location;

  if (!map[key]) {
    map[key] = {
      location: key,
      totalReports: 0,
      avgRisk: 0,
      highRiskCount: 0
    };
  }

  map[key].totalReports += 1;

  map[key].avgRisk =
    (map[key].avgRisk + item.riskScore) / map[key].totalReports;

  if (item.riskScore >= 70) {
    map[key].highRiskCount += 1;
  }
});

return Object.values(map);
```

}

/**

* Get raw intelligence data
  */
  getAll() {
  return this.data;
  }

/**

* Clear system (admin use)
  */
  clear() {
  this.data = [];
  }
  }

module.exports = new HeatmapEngine();
