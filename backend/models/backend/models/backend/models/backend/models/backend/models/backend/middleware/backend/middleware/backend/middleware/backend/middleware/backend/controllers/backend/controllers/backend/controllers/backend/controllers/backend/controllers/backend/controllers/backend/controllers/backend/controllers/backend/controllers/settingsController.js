const Settings = require('../models/Settings');

// @desc    Get all system settings
// @route   GET /api/settings
// @access  Protected (Admin)
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Protected (Admin)
const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      Object.keys(updates).forEach((key) => {
        settings[key] = updates[key];
      });
      await settings.save();
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a specific feature
// @route   PUT /api/settings/toggle/:feature
// @access  Protected (Admin)
const toggleFeature = async (req, res) => {
  try {
    const { feature } = req.params;
    const settings = await Settings.findOne();

    if (!settings || !Object.hasOwn(settings.toObject(), feature)) {
      return res.status(400).json({ message: 'Feature not found in settings' });
    }

    settings[feature] = !settings[feature];
    await settings.save();

    res.status(200).json({ feature, enabled: settings[feature] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  toggleFeature,
};
