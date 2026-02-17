const ChatMessage = require('../models/ChatMessage');
const ScamReport = require('../models/ScamReport');
const Community = require('../models/Community');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @desc    Get user activity analytics
// @route   GET /api/analytics/users
// @access  Protected (Admin/Moderator)
const getUserActivity = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('name email createdAt');
    res.status(200).json({ totalUsers, recentUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get community engagement analytics
// @route   GET /api/analytics/communities
// @access  Protected (Admin/Moderator)
const getCommunityEngagement = async (req, res) => {
  try {
    const communities = await Community.find();
    const engagementData = await Promise.all(
      communities.map(async (comm) => {
        const messageCount = await ChatMessage.countDocuments({ community: comm._id });
        return {
          communityId: comm._id,
          name: comm.name,
          messages: messageCount,
        };
      })
    );

    res.status(200).json(engagementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get scam trend analytics
// @route   GET /api/analytics/scams
// @access  Protected (Admin/Moderator)
const getScamTrends = async (req, res) => {
  try {
    const totalReports = await ScamReport.countDocuments();
    const verifiedReports = await ScamReport.countDocuments({ status: 'verified' });
    const pendingReports = await ScamReport.countDocuments({ status: 'pending' });

    res.status(200).json({ totalReports, verifiedReports, pendingReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get audit log statistics
// @route   GET /api/analytics/audit-logs
// @access  Protected (Admin/Moderator)
const getAuditStats = async (req, res) => {
  try {
    const totalLogs = await AuditLog.countDocuments();
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(20)
      .populate('performedBy', 'name email role');

    res.status(200).json({ totalLogs, recentLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserActivity,
  getCommunityEngagement,
  getScamTrends,
  getAuditStats,
};
