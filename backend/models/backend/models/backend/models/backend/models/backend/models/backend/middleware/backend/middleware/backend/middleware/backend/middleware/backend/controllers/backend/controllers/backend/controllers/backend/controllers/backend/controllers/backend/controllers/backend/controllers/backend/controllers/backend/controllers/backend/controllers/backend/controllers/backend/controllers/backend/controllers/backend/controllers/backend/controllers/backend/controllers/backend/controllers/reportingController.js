const ScamReport = require('../models/ScamReport');
const ChatMessage = require('../models/ChatMessage');
const { createAuditLog } = require('./auditController');
const Alert = require('./alertController');

// @desc    Submit a new scam/content report
// @route   POST /api/reports/submit
// @access  Protected
const submitReport = async (req, res) => {
  try {
    const { title, description, targetMessageId } = req.body;

    // Optionally link to a chat message
    let targetMessage = null;
    if (targetMessageId) {
      targetMessage = await ChatMessage.findById(targetMessageId);
      if (!targetMessage) return res.status(404).json({ message: 'Target message not found' });
    }

    const report = await ScamReport.create({
      title,
      description,
      reporter: req.user._id,
      targetMessage: targetMessageId || null,
      status: 'pending',
    });

    await createAuditLog({
      action: 'submit_report',
      performedBy: req.user._id,
      target: report._id,
      details: 'User submitted a new report',
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (admin/moderator view)
// @route   GET /api/reports
// @access  Protected (Admin/Moderator)
const getAllReports = async (req, res) => {
  try {
    const reports = await ScamReport.find()
      .populate('reporter', 'name email role')
      .populate('targetMessage', 'message sender')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status (verify, reject, etc.)
// @route   PUT /api/reports/:reportId/status
// @access  Protected (Admin/Moderator)
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await ScamReport.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;
    await report.save();

    await createAuditLog({
      action: 'update_report_status',
      performedBy: req.user._id,
      target: report._id,
      details: `Report status updated to ${status}`,
    });

    // Optionally generate alert for verified scams
    if (status === 'verified') {
      await Alert.create({
        title: 'Verified Scam Alert',
        message: `Report "${report.title}" has been verified`,
        type: 'scam',
        createdBy: req.user._id,
        targetUsers: [],
      });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitReport,
  getAllReports,
  updateReportStatus,
};
