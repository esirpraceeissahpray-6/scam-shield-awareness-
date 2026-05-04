/**

* Scam Shield AI - Report Routes
* Handles scam report API endpoints
  */

const express = require("express");
const router = express.Router();

const scamReportController = require("../controllers/scamReportController");

// Optional: add CAPTCHA later if needed
// const captchaValidator = require("../middleware/captchaValidator");

/**

* @route   POST /api/report
* @desc    Submit a scam report
  */
  router.post("/report", scamReportController);

module.exports = router;
