const Alert = require('../models/Alert');
const { createAuditLog } = require('./auditController');

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Protected (Admin/Moderator)
const createAlert = async (req, res) => {
  try {
    const { title, message, type, targetUsers } = req.body;

    const alert = await Alert.create({
      title,
      message,
      type,
      createdBy: req.user._id,
      targetUsers: targetUsers || [],
    });

    await createAuditLog({
      action: 'create_alert',
      performedBy: req.user._id,
      target: alert._id,
      details: `Alert "${title}" created`,
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all alerts (optionally filter by type)
// @route   GET /api/alerts
// @access  Protected
const getAlerts = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an alert
// @route   PUT /api/alerts/:alertId
// @access  Protected (Admin/Moderator)
const updateAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { title, message, type, targetUsers } = req.body;

    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    if (title) alert.title = title;
    if (message) alert.message = message;
    if (type) alert.type = type;
    if (targetUsers) alert.targetUsers = targetUsers;

    await alert.save();

    await createAuditLog({
      action: 'update_alert',
      performedBy: req.user._id,
      target: alert._id,
      details: `Alert "${alert.title}" updated`,
    });

    res.status(200).json(alert);
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

    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    await Alert.findByIdAndDelete(alertId);

    await createAuditLog({
      action: 'delete_alert',
      performedBy: req.user._id,
      target: alertId,
      details: `Alert "${alert.title}" deleted`,
    });

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert,
};
