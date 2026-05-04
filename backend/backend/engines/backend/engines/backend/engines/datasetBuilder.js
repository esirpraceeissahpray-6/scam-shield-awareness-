/**

* Scam Shield AI - Dataset Builder Engine
* Builds structured datasets for AI training
  */

class DatasetBuilder {
constructor() {
this.dataset = [];
this.batchSize = 50; // MVP batch size
}

/**

* Add labeled data into dataset
  */
  addData(labeledData) {
  this.dataset.push(labeledData);

```
// Auto-batch trigger (future training readiness)
```

```
if (this.dataset.length >= this.batchSize) {
  this.createBatch();
}

return this.dataset.length;
```

}

/**

* Create a training batch
  */
  createBatch() {
  const batch = this.dataset.splice(0, this.batchSize);

```
return {
```

```
  batchId: Date.now(),
  size: batch.length,
  data: batch
};
```

}

/**

* Get full dataset
  */
  getDataset() {
  return this.dataset;
  }

/**

* Export dataset (for future ML training)
  */
  exportDataset() {
  return {
  totalSamples: this.dataset.length,
  dataset: this.dataset
  };
  }

/**

* Clear dataset (admin/reset)
  */
  clear() {
  this.dataset = [];
  }
  }

module.exports = new DatasetBuilder();
