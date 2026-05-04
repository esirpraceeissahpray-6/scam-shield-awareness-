/**

* Scam Shield AI - Data Export Engine
* Exports datasets for future AI training
  */

const datasetBuilder = require("./datasetBuilder");

class DataExportEngine {
/**

* Export dataset as JSON (MVP)
  */
  exportJSON() {
  return {
  exportedAt: new Date().toISOString(),
  totalSamples: datasetBuilder.getDataset().length,
  data: datasetBuilder.getDataset()
  };
  }

/**

* Convert dataset to CSV format (basic)
  */
  exportCSV() {
  const data = datasetBuilder.getDataset();

```
const header = "input,label,category,confidence\n";
```

```
const rows = data.map(item => {
  return `"${item.input}","${item.label}","${item.category}",${item.confidence}`;
});

return header + rows.join("\n");
```

}

/**

* Clear export cache (optional reset)
  */
  reset() {
  return {
  message: "Export layer is stateless in MVP"
  };
  }
  }

module.exports = new DataExportEngine();
