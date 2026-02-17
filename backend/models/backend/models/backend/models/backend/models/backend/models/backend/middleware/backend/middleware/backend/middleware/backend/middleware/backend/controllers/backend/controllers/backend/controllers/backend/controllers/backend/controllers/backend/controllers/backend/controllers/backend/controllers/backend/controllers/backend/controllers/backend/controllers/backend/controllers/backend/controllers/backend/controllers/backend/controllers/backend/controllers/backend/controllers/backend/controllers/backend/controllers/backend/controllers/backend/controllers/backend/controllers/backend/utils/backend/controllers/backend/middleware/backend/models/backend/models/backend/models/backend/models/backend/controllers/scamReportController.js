const asyncHandler = require('express-async-handler');
const ScamReport = require('../models/ScamReport');
const AuditLog = require('../models/AuditLog');

/*
  @desc    Create new scam report
  @route   POST /api/reports
  @access  Private
*/
const createReport = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    scamType,
    evidenceLinks,
    contactInfoUsed,
    amountLost,
    currency
  } = req.body;

  // Basic AI Risk Placeholder (To be replaced by AI Engine Service)
  const aiRiskScore = description.length > 300 ? 75 : 35;

  const report = await ScamReport.create({
    title,
    description,
    scamType,
    evidenceLinks,
    contactInfoUsed,
    amountLost,
    currency,
    aiRiskScore,
    reportedBy: req.user._id
  });

  // Audit Log
  await AuditLog.create({
    user: req.user._id,
    actorType: 'user',
    action: 'CREATE_REPORT',
    entityType: 'ScamReport',
    entityId: report._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json(report);
});


/*
  @desc    Get all public reports
  @route   GET /api/reports
  @access  Public
*/
const getPublicReports = asyncHandler(async (req, res) => {
  const reports = await ScamReport.find({ isPublic: true })
    .populate('reportedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(reports);
});


/*
  @desc    Admin: Update report status
  @route   PUT /api/reports/:id/status
  @access  Admin
*/
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const report = await ScamReport.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  report.status = status;
  report.reviewedBy = req.user._id;

  await report.save();

  // Audit Log
  await AuditLog.create({
    user: req.user._id,
    actorType: 'admin',
    action: 'UPDATE_REPORT_STATUS',
    entityType: 'ScamReport',
    entityId: report._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.json(report);
});


/*
  @desc    Get single report by ID
  @route   GET /api/reports/:id
  @access  Public
*/
const getReportById = asyncHandler(async (req, res) => {
  const report = await ScamReport.findById(req.params.id)
    .populate('reportedBy', 'name email')
    .populate('reviewedBy', 'name email');

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  res.json(report);
});


module.exports = {
  createReport,
  getPublicReports,
  updateReportStatus,
  getReportById
};
