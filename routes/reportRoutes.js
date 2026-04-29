// routes/reportRoutes.js

const express = require("express");

const router = express.Router();

/*
Import Report Controller

This connects routes to logic.
*/

const {
  submitReport
} = require("../controllers/reportController");

/*
Report Submission Route

Endpoint:
POST /api/reports

Purpose:
Allows users to submit scam reports
from the frontend to the backend.
*/

router.post("/reports", submitReport);

/*
Export Router

Allows server.js to use this route.
*/

module.exports = router;
