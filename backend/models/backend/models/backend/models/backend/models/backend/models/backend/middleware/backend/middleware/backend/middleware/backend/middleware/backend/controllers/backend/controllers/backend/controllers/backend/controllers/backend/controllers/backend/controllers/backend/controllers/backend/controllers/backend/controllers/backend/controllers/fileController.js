const fs = require('fs');
const path = require('path');
const ChatMessage = require('../models/ChatMessage');
const ScamReport = require('../models/ScamReport');
const Alert = require('../models/Alert');

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Protected
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // For simplicity, storing file info in response (could store path in DB)
    const fileData = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    res.status(201).json(fileData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a file
// @route   DELETE /api/files/:filename
// @access  Protected
const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get file metadata for a message/report
// @route   GET /api/files/:entity/:id
// @access  Protected
const getFilesForEntity = async (req, res) => {
  try {
    const { entity, id } = req.params;
    let files = [];

    switch (entity) {
      case 'chat':
        const chat = await ChatMessage.findById(id);
        if (!chat) return res.status(404).json({ message: 'Chat message not found' });
        files = chat.attachments || [];
        break;
      case 'report':
        const report = await ScamReport.findById(id);
        if (!report) return res.status(404).json({ message: 'Scam report not found' });
        files = report.attachments || [];
        break;
      case 'alert':
        const alert = await Alert.findById(id);
        if (!alert) return res.status(404).json({ message: 'Alert not found' });
        files = alert.attachments || [];
        break;
      default:
        return res.status(400).json({ message: 'Invalid entity type' });
    }

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getFilesForEntity,
};
