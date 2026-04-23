// checkerRoutes.js

const express = require("express");

const router = express.Router();

const {
    checkMessage
} = require("../controllers/checkerController");

// POST message check
router.post("/", checkMessage);

module.exports = router;
