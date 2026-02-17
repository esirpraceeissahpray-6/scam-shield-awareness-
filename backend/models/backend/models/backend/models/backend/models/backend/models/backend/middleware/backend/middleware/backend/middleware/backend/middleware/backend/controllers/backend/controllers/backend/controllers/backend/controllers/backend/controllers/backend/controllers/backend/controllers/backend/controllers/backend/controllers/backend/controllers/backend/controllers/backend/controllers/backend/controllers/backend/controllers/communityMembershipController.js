const Community = require('../models/Community');
const User = require('../models/User');

// @desc    Join a community
// @route   POST /api/community/:communityId/join
// @access  Protected
const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      await community.save();
    }

    res.status(200).json({ message: 'Joined community successfully', community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave a community
// @route   POST /api/community/:communityId/leave
// @access  Protected
const leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    community.members = community.members.filter((id) => id.toString() !== req.user._id.toString());
    await community.save();

    res.status(200).json({ message: 'Left community successfully', community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign role to a community member
// @route   PUT /api/community/:communityId/assign-role
// @access  Protected (Admin/Moderator)
const assignRole = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { userId, role } = req.body;

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (!community.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this community' });
    }

    community.roles = community.roles || {};
    community.roles.set(userId, role);
    await community.save();

    res.status(200).json({ message: 'Role assigned successfully', community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all members of a community
// @route   GET /api/community/:communityId/members
// @access  Protected
const getMembers = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId).populate('members', 'name email role');
    if (!community) return res.status(404).json({ message: 'Community not found' });

    res.status(200).json({ members: community.members, roles: community.roles || {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  joinCommunity,
  leaveCommunity,
  assignRole,
  getMembers,
};
