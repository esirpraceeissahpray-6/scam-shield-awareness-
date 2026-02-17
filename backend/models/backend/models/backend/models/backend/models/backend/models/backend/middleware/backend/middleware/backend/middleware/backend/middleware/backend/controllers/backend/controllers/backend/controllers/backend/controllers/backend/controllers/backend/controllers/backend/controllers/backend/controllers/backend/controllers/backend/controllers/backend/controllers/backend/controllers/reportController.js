const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const ScamReport = require('../models/ScamReport');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// @desc    Export scam reports as PDF
// @route   GET /api/reports/scam/pdf
// @access  Protected (Admin/Moderator)
const exportScamReportsPDF = async (req, res) => {
  try {
    const reports = await ScamReport.find().populate('reporter', 'name email');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=scam_reports.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Scam Reports', { align: 'center' });
    doc.moveDown();

    reports.forEach((report, idx) => {
      doc.fontSize(12).text(`${idx + 1}. Title: ${report.title}`);
      doc.text(`Reporter: ${report.reporter.name} (${report.reporter.email})`);
      doc.text(`Status: ${report.status}`);
      doc.text(`Description: ${report.description}`);
      doc.text(`Created At: ${report.createdAt}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export audit logs as CSV
// @route   GET /api/reports/audit/csv
// @access  Protected (Admin/Moderator)
const exportAuditLogsCSV = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('performedBy', 'name email');

    const data = logs.map((log) => ({
      Action: log.action,
      PerformedBy: log.performedBy.name,
      Target: log.target,
      Details: log.details,
      Date: log.createdAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('audit_logs.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export analytics as JSON
// @route   GET /api/reports/analytics
// @access  Protected (Admin/Moderator)
const exportAnalytics = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const scamReportsCount = await ScamReport.countDocuments();
    const verifiedScamsCount = await ScamReport.countDocuments({ status: 'verified' });

    res.status(200).json({
      usersCount,
      scamReportsCount,
      verifiedScamsCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  exportScamReportsPDF,
  exportAuditLogsCSV,
  exportAnalytics,
};
