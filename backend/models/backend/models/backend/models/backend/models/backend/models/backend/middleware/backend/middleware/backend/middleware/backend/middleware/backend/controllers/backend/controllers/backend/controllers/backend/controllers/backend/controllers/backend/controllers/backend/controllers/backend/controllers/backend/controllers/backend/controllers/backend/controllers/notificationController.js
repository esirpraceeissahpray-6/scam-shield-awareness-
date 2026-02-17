const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Send a notification to specific users
// @route   POST /api/notifications/send
// @access  Protected (Admin/Moderator)
const sendNotification = async (req, res) => {
  try {
    const { title, message, recipients } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ message: 'No recipients specified' });
    }

    const notifications = await Notification.insertMany(
      recipients.map((userId) => ({
        title,
        message,
        user: userId,
        read: false,
      }))
    );

    res.status(201).json({ sent: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Protected
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Protected
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markAsRead,
};
