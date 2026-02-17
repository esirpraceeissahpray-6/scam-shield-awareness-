const ChatMessage = require('../models/ChatMessage');
const Community = require('../models/Community');

// @desc    Create a new chat message
// @route   POST /api/chat/:communityId
// @access  Protected
const createChatMessage = async (req, res) => {
  try {
    const { message, attachments } = req.body;
    const { communityId } = req.params;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const chatMessage = await ChatMessage.create({
      sender: req.user._id,
      community: communityId,
      message,
      attachments,
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for a community
// @route   GET /api/chat/:communityId
// @access  Protected
const getCommunityMessages = async (req, res) => {
  try {
    const { communityId } = req.params;
    const messages = await ChatMessage.find({ community: communityId })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Flag a suspicious message
// @route   PUT /api/chat/flag/:messageId
// @access  Protected (Moderator/Admin)
const flagMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reason } = req.body;

    const flaggedMessage = await ChatMessage.flagMessage(messageId, reason);
    if (!flaggedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(flaggedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/chat/:messageId
// @access  Protected (Admin)
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deleted = await ChatMessage.findByIdAndDelete(messageId);

    if (!deleted) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChatMessage,
  getCommunityMessages,
  flagMessage,
  deleteMessage,
};
