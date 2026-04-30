// routes/reportRoutes.js

const express = require("express");
const router = express.Router();

/*
Import Report Controller
*/
const { submitReport } = require("../controllers/reportController");

/*
Report Submission Route

Final Endpoint:
POST /api/reports
*/

router.post("/", submitReport);

module.exports = router;
