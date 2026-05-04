/**

* Scam Shield AI - Intelligence Routes
* Exposes system-wide intelligence data
  */

const express = require("express");
const router = express.Router();

const intelligenceAggregator = require("../engines/intelligenceAggregator");

/**

* @route   GET /api/intelligence
* @desc    Get full intelligence overview
  */
  router.get("/intelligence", (req, res) => {
  try {
  const data = intelligenceAggregator.generateOverview();

  res.status(200).json({
  success: true,
  data
  });

} catch (error) {
console.error("Intelligence Route Error:", error.message);

```
res.status(500).json({
  success: false,
  message: "Failed to fetch intelligence data"
});
```

}
});

/**

* @route   GET /api/intelligence/trust/:userId
* @desc    Get trust score for a user
  */
  router.get("/intelligence/trust/:userId", (req, res) => {
  try {
  const { userId } = req.params;

  const trust = intelligenceAggregator.getUserTrust(userId);

  res.status(200).json({
  success: true,
  trust
  });

} catch (error) {
console.error("Trust Route Error:", error.message);

```
res.status(500).json({
  success: false,
  message: "Failed to fetch trust score"
});
```

}
});

module.exports = router;
