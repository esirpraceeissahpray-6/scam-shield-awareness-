const Alert = require('../models/Alert');
const User = require('../models/User');

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Protected (Admin/Moderator)
const createAlert = async (req, res) => {
  try {
    const { title, message, type, targetUsers } = req.body;

    const alert = await Alert.create({
      title,
      message,
      type, // e.g., 'scam', 'system', 'community'
      createdBy: req.user._id,
      targetUsers, // array of user IDs or null for all
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Protected
const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an alert
// @route   DELETE /api/alerts/:alertId
// @access  Protected (Admin/Moderator)
const deleteAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const deleted = await Alert.findByIdAndDelete(alertId);
    if (!deleted) return res.status(404).json({ message: 'Alert not found' });

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAlert,
  getAllAlerts,
  deleteAlert,
};
