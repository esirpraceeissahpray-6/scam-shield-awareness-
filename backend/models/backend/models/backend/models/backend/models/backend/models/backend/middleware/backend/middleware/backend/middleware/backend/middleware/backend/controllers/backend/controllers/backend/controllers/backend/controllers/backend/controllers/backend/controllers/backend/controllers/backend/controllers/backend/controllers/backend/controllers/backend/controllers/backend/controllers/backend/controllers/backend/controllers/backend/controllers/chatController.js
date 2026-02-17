const ChatMessage = require('../models/ChatMessage');
const Community = require('../models/Community');
const { createAuditLog } = require('./auditController');

// @desc    Send a chat message
// @route   POST /api/chat/:communityId/send
// @access  Protected
const sendMessage = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { message, attachments } = req.body;

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    const chatMessage = await ChatMessage.create({
      sender: req.user._id,
      community: communityId,
      message,
      attachments: attachments || [],
    });

    await createAuditLog({
      action: 'send_message',
      performedBy: req.user._id,
      target: chatMessage._id,
      details: `Message sent in community ${community.name}`,
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat messages for a community
// @route   GET /api/chat/:communityId/messages
// @access  Protected
const getCommunityMessages = async (req, res) => {
  try {
    const { communityId } = req.params;

    const messages = await ChatMessage.find({ community: communityId })
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a chat message
// @route   DELETE /api/chat/:messageId
// @access  Protected (Admin/Moderator)
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ChatMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    await ChatMessage.findByIdAndDelete(messageId);

    await createAuditLog({
      action: 'delete_message',
      performedBy: req.user._id,
      target: messageId,
      details: 'Message deleted by moderator/admin',
    });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getCommunityMessages,
  deleteMessage,
};
