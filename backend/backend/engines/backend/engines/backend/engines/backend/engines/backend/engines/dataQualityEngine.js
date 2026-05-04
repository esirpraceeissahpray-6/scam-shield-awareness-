/**

* Scam Shield AI - Data Quality Engine
* Filters and validates dataset before AI training
  */

class DataQualityEngine {
/**

* Validate single data entry
  */
  validate(entry, trustScore = 50) {
  if (!entry) return false;

```
// 1. Check required fields
```

```
if (!entry.input || !entry.label) return false;

// 2. Remove empty or too short messages
if (entry.input.length < 5) return false;

// 3. Block low trust contributors
if (trustScore < 30) return false;

// 4. Block low confidence labels
if (entry.confidence < 0.5) return false;

return true;
```

}

/**

* Clean dataset before training
  */
  filterDataset(dataset, trustMap = {}) {
  const cleaned = [];

```
for (const item of dataset) {
```

```
  const trustScore = trustMap[item.userId] || 50;

  if (this.validate(item, trustScore)) {
    cleaned.push(item);
  }
}

return cleaned;
```

}

/**

* Detect dataset quality score
  */
  datasetQualityScore(dataset) {
  if (!dataset.length) return 0;

```
const valid = dataset.filter(item =>
```

```
  item.confidence >= 0.5
).length;

return Number((valid / dataset.length).toFixed(2));
```

}

/**

* Check if dataset is safe for training
  */
  isTrainable(dataset) {
  const score = this.datasetQualityScore(dataset);

```
return score >= 0.7; // 70% quality threshold
```

}
}

module.exports = new DataQualityEngine();
