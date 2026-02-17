const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// @desc    Create a new audit log entry
// @route   POST /api/audit-logs
// @access  Protected (System/Automated)
const createAuditLog = async ({ action, performedBy, target, details }) => {
  try {
    const log = await AuditLog.create({
      action,
      performedBy, // user ID
      target,      // affected entity ID (e.g., ChatMessage, ScamReport)
      details,
    });

    return log;
  } catch (error) {
    console.error('Audit log creation failed:', error.message);
  }
};

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Protected (Admin/Moderator)
const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get audit logs filtered by entity or action
// @route   GET /api/audit-logs/filter
// @access  Protected (Admin/Moderator)
const getFilteredLogs = async (req, res) => {
  try {
    const { action, target } = req.query;
    const query = {};
    if (action) query.action = action;
    if (target) query.target = target;

    const logs = await AuditLog.find(query)
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAuditLog,
  getAllAuditLogs,
  getFilteredLogs,
};
