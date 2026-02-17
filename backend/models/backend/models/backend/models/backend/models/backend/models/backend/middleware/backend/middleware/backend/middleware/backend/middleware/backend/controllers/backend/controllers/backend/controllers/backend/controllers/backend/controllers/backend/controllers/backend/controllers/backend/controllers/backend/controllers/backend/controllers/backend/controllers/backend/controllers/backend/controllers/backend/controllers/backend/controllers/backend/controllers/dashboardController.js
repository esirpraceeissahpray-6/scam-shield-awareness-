const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const ScamReport = require('../models/ScamReport');
const AuditLog = require('../models/AuditLog');
const Alert = require('../models/Alert');

// @desc    Get dashboard overview metrics
// @route   GET /api/dashboard/overview
// @access  Protected (Admin/Moderator)
const getDashboardOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCommunities = await ChatMessage.distinct('community').then((arr) => arr.length);
    const totalScamReports = await ScamReport.countDocuments();
    const verifiedScamReports = await ScamReport.countDocuments({ status: 'verified' });
    const flaggedMessages = await ChatMessage.countDocuments({ isFlagged: true });
    const recentAlerts = await Alert.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      totalUsers,
      totalCommunities,
      totalScamReports,
      verifiedScamReports,
      flaggedMessages,
      recentAlerts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent moderation actions
// @route   GET /api/dashboard/moderation-actions
// @access  Protected (Admin/Moderator)
const getRecentModerationActions = async (req, res) => {
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

// @desc    Get top flagged communities
// @route   GET /api/dashboard/top-flagged-communities
// @access  Protected (Admin/Moderator)
const getTopFlaggedCommunities = async (req, res) => {
  try {
    const aggregation = await ChatMessage.aggregate([
      { $match: { isFlagged: true } },
      { $group: { _id: '$community', flaggedCount: { $sum: 1 } } },
      { $sort: { flaggedCount: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(aggregation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardOverview,
  getRecentModerationActions,
  getTopFlaggedCommunities,
};
