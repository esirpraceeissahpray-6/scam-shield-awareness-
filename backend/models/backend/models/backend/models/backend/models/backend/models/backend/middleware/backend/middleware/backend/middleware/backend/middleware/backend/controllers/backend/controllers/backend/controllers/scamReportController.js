const ScamReport = require('../models/ScamReport');
const User = require('../models/User');

// @desc    Submit a new scam report
// @route   POST /api/scam-reports
// @access  Protected
const submitScamReport = async (req, res) => {
  try {
    const { title, description, evidence } = req.body;

    const report = await ScamReport.create({
      reporter: req.user._id,
      title,
      description,
      evidence,
      status: 'pending',
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all scam reports
// @route   GET /api/scam-reports
// @access  Protected (Admin/Moderator)
const getAllScamReports = async (req, res) => {
  try {
    const reports = await ScamReport.find()
      .populate('reporter', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update scam report status
// @route   PUT /api/scam-reports/:reportId
// @access  Protected (Admin/Moderator)
const updateScamReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const updatedReport = await ScamReport.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a scam report
// @route   DELETE /api/scam-reports/:reportId
// @access  Protected (Admin)
const deleteScamReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const deleted = await ScamReport.findByIdAndDelete(reportId);
    if (!deleted) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    res.status(200).json({ message: 'Scam report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitScamReport,
  getAllScamReports,
  updateScamReportStatus,
  deleteScamReport,
};
