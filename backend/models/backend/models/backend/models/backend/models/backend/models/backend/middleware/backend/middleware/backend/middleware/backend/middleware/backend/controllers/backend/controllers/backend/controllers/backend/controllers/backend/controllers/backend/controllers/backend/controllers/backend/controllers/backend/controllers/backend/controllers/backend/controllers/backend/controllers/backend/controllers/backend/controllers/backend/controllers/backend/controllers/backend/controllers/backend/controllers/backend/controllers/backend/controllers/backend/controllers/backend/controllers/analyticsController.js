const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const ScamReport = require('../models/ScamReport');
const AuditLog = require('../models/AuditLog');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Protected (Admin/Moderator)
const getAnalyticsOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsersLast7Days = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24*60*60*1000) } });
    const totalScamReports = await ScamReport.countDocuments();
    const verifiedScams = await ScamReport.countDocuments({ status: 'verified' });
    const flaggedMessages = await ChatMessage.countDocuments({ isFlagged: true });
    const recentModerationActions = await AuditLog.find({ action: { $in: ['flag_message', 'verify_report', 'delete_message'] } }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      totalUsers,
      activeUsersLast7Days,
      totalScamReports,
      verifiedScams,
      flaggedMessages,
      recentModerationActions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI scam trend analysis
// @route   GET /api/analytics/scam-trends
// @access  Protected (Admin/Moderator)
const getScamTrends = async (req, res) => {
  try {
    const trends = await ScamReport.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top flagged users
// @route   GET /api/analytics/top-flagged-users
// @access  Protected (Admin/Moderator)
const getTopFlaggedUsers = async (req, res) => {
  try {
    const flaggedUsers = await ChatMessage.aggregate([
      { $match: { isFlagged: true } },
      { $group: { _id: "$sender", flaggedCount: { $sum: 1 } } },
      { $sort: { flaggedCount: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(flaggedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalyticsOverview,
  getScamTrends,
  getTopFlaggedUsers,
};
