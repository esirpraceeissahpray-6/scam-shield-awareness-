/**
 * Hybrid Scam Shield AI
 * API Routes
 *
 * Purpose:
 * - Expose backend services via REST API
 * - Connect models, engines, dashboards, and external feeds
 */

const express = require('express');
const router = express.Router();

// Middleware
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorHandler');

// Services
const { getDashboardOverview } = require('../services/dashboardAnalyticsService');
const { processExternalReports, fetchExternalFeed } = require('../services/externalThreatFeedService');
const { enforceUserActions } = require('../services/escalationEnforcementEngine');
const { processThreatForAlerts } = require('../services/autoAlertTriggerEngine');
const { buildFraudNetworkGraph } = require('../services/fraudNetworkGraphBuilder');
const { computeUserRiskProfile } = require('../services/behavioralRiskAggregator');
const ScamReport = require('../models/ScamReport');
const Alert = require('../models/Alert');
const User = require('../models/User');

/**
 * @route POST /api/reports
 * Submit a new scam report
 */
router.post('/reports', protect, async (req, res, next) => {
  try {
    const report = await ScamReport.create({ ...req.body, reportedBy: req.user._id });
    const alert = await processThreatForAlerts(report, req.user._id);
    const enforcement = await enforceUserActions(report, req.user._id);
    res.status(201).json({ report, alert, enforcement });
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/reports
 * Fetch all reports (admin)
 */
router.get('/reports', protect, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const reports = await ScamReport.find({});
    res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/alerts
 * Fetch all alerts
 */
router.get('/alerts', protect, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const alerts = await Alert.find({});
    res.status(200).json(alerts);
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/users/:id/profile
 * Fetch user risk & anomaly profile
 */
router.get('/users/:id/profile', protect, async (req, res, next) => {
  try {
    const userProfile = await computeUserRiskProfile(req.params.id);
    res.status(200).json(userProfile);
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/dashboard/overview
 * Fetch aggregated dashboard analytics
 */
router.get('/dashboard/overview', protect, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const overview = await getDashboardOverview();
    res.status(200).json(overview);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/external-feed
 * Ingest external threat feed
 */
router.post('/external-feed', protect, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const { feedUrl } = req.body;
    const externalReports = await fetchExternalFeed(feedUrl);
    await processExternalReports(externalReports);
    res.status(200).json({ message: 'External feed processed successfully', count: externalReports.length });
  } catch (err) {
    next(err);
  }
});

// Error Handler Middleware
router.use(errorHandler);

module.exports = router;
