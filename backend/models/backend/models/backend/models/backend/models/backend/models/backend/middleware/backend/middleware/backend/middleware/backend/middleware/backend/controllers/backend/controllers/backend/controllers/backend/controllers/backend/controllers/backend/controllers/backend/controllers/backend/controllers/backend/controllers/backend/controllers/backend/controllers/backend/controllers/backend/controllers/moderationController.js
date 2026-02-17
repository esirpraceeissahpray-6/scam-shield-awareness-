const ChatMessage = require('../models/ChatMessage');
const ScamReport = require('../models/ScamReport');
const AuditLog = require('../models/AuditLog');
const Alert = require('../models/Alert');

// @desc    Get all flagged messages
// @route   GET /api/moderation/flagged-messages
// @access  Protected (Admin/Moderator)
const getFlaggedMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ isFlagged: true })
      .populate('sender', 'name email role')
      .sort({ flaggedAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all flagged scam reports
// @route   GET /api/moderation/flagged-reports
// @access  Protected (Admin/Moderator)
const getFlaggedReports = async (req, res) => {
  try {
    const reports = await ScamReport.find({ status: 'pending' })
      .populate('reporter', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log AI moderation decision
// @route   POST /api/moderation/log
// @access  Protected (System/AI)
const logAIDecision = async (req, res) => {
  try {
    const { action, entityType, entityId, decision, details } = req.body;

    const log = await AuditLog.create({
      action,
      performedBy: null, // system/AI
      target: entityId,
      details: `AI Decision: ${decision} | ${details || ''}`,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent moderation logs
// @route   GET /api/moderation/logs
// @access  Protected (Admin/Moderator)
const getModerationLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ action: { $in: ['flag_message', 'verify_report', 'delete_message'] } })
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFlaggedMessages,
  getFlaggedReports,
  logAIDecision,
  getModerationLogs,
};
