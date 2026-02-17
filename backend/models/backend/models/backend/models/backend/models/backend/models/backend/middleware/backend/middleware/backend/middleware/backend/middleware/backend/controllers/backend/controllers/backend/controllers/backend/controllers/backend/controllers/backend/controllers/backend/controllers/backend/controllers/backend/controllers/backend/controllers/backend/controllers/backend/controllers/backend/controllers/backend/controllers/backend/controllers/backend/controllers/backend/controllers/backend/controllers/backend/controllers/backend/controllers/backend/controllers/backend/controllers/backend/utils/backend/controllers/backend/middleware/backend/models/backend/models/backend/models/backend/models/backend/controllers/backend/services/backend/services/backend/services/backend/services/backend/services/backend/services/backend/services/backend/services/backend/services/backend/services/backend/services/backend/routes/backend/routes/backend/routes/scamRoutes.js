/**
 * Hybrid Scam Shield AI
 * Scam Reports Routes
 *
 * Purpose:
 * - Handle submission, management, and retrieval of scam reports
 * - Integrate with Threat Orchestrator, Auto Alerts, and Enforcement Engine
 * - Enforce authentication and role-based access
 */

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const ScamReport = require('../models/ScamReport');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorHandler');
const { processThreatForAlerts } = require('../services/autoAlertTriggerEngine');
const { enforceUserActions } = require('../services/escalationEnforcementEngine');
const { evaluateThreat } = require('../services/threatOrchestrator');

/**
 * @route POST /api/scams
 * Submit a new scam report
 */
router.post('/', protect, asyncHandler(async (req, res) => {
  const report = await ScamReport.create({ ...req.body, reportedBy: req.user._id });

  // 1️⃣ Evaluate threat
  const threatAnalysis = await evaluateThreat(report, req.user._id);

  // 2️⃣ Trigger auto alerts
  const alert = await processThreatForAlerts(report, req.user._id);

  // 3️⃣ Enforce escalation if needed
  const enforcement = await enforceUserActions(report, req.user._id);

  res.status(201).json({ report, threatAnalysis, alert, enforcement });
}));

/**
 * @route GET /api/scams
 * Get all scam reports (admin only)
 */
router.get('/', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const reports = await ScamReport.find({})
    .populate('reportedBy', 'name email')
    .populate('community', 'name');
  res.status(200).json(reports);
}));

/**
 * @route GET /api/scams/:id
 * Get single scam report
 */
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const report = await ScamReport.findById(req.params.id)
    .populate('reportedBy', 'name email')
    .populate('community', 'name');

  if (!report) {
    res.status(404);
    throw new Error('Scam report not found');
  }

  // Only admin or reporter can access
  if (req.user.role !== 'admin' && report.reportedBy._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.status(200).json(report);
}));

/**
 * @route PATCH /api/scams/:id
 * Update scam report (admin or reporter)
 */
router.patch('/:id', protect, asyncHandler(async (req, res) => {
  const report = await ScamReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Scam report not found');
  }

  if (req.user.role !== 'admin' && report.reportedBy._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  Object.assign(report, req.body);
  const updatedReport = await report.save();
  res.status(200).json(updatedReport);
}));

/**
 * @route DELETE /api/scams/:id
 * Delete scam report (admin only)
 */
router.delete('/:id', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const report = await ScamReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Scam report not found');
  }

  await report.remove();
  res.status(200).json({ message: 'Scam report deleted' });
}));

// Error handler
router.use(errorHandler);

module.exports = router;
