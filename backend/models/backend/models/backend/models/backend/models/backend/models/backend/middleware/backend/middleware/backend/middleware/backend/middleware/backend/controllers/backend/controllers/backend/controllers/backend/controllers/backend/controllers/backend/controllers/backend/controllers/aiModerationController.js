const ChatMessage = require('../models/ChatMessage');
const ScamReport = require('../models/ScamReport');
const Alert = require('../models/Alert');
const { createAuditLog } = require('./auditController');

// Mock AI detection function (replace with actual AI engine integration)
const detectScamContent = async (text) => {
  const scamKeywords = ['lottery', 'transfer money', 'winner', 'prize', 'click here'];
  const lowerText = text.toLowerCase();
  return scamKeywords.some((keyword) => lowerText.includes(keyword));
};

// @desc    Analyze and flag suspicious chat messages
// @route   POST /api/ai-moderation/scan-chat/:messageId
// @access  Protected (Moderator/Admin)
const scanChatMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await ChatMessage.findById(messageId);

    if (!message) return res.status(404).json({ message: 'Message not found' });

    const isScam = await detectScamContent(message.message);
    if (isScam) {
      message.isFlagged = true;
      message.flaggedReason = 'AI detected potential scam';
      await message.save();

      await createAuditLog({
        action: 'flag_message',
        performedBy: req.user._id,
        target: message._id,
        details: 'Message flagged by AI moderation',
      });

      // Optionally generate an alert
      await Alert.create({
        title: 'Suspicious Message Detected',
        message: `Message by ${req.user.name} flagged as potential scam`,
        type: 'scam',
        createdBy: req.user._id,
        targetUsers: [], // broadcast to all users
      });
    }

    res.status(200).json({ flagged: isScam, message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze and flag scam reports for AI verification
// @route   POST /api/ai-moderation/verify-report/:reportId
// @access  Protected (Moderator/Admin)
const verifyScamReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await ScamReport.findById(reportId);

    if (!report) return res.status(404).json({ message: 'Scam report not found' });

    const isScam = await detectScamContent(report.description);
    if (isScam) {
      report.status = 'verified';
      await report.save();

      await createAuditLog({
        action: 'verify_report',
        performedBy: req.user._id,
        target: report._id,
        details: 'Scam report verified by AI moderation',
      });

      // Generate alert for community
      await Alert.create({
        title: 'Verified Scam Alert',
        message: `Scam report titled "${report.title}" has been verified`,
        type: 'scam',
        createdBy: req.user._id,
        targetUsers: [],
      });
    }

    res.status(200).json({ verified: isScam, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scanChatMessage,
  verifyScamReport,
};
