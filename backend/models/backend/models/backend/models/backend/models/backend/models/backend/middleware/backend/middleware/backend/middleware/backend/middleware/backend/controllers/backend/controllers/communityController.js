const Community = require('../models/Community');
const User = require('../models/User');

// @desc    Create a new community
// @route   POST /api/community
// @access  Protected (Admin/Moderator)
const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Community.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Community with this name already exists' });
    }

    const community = await Community.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all communities
// @route   GET /api/community
// @access  Protected
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a community
// @route   PUT /api/community/:communityId
// @access  Protected (Admin/Moderator)
const updateCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const updates = req.body;

    const community = await Community.findByIdAndUpdate(communityId, updates, { new: true });
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a community
// @route   DELETE /api/community/:communityId
// @access  Protected (Admin)
const deleteCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const deleted = await Community.findByIdAndDelete(communityId);
    if (!deleted) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.status(200).json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  updateCommunity,
  deleteCommunity,
};
