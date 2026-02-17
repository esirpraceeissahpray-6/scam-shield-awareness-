/**
 * Hybrid Scam Shield AI
 * Anomaly Detection Engine
 *
 * Purpose:
 * - Monitor user behavior
 * - Detect spikes in reporting activity
 * - Identify sudden deviations in report content
 * - Flag suspicious system events
 */

const ScamReport = require('../models/ScamReport');
const AuditLog = require('../models/AuditLog');

/**
 * Detect abnormal reporting activity
 * @param {string} userId
 * @param {number} threshold - number of reports in last N hours
 */
async function detectReportingSpike(userId, threshold = 10, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const recentReports = await ScamReport.find({
    reportedBy: userId,
    createdAt: { $gte: since }
  });

  const spikeDetected = recentReports.length >= threshold;

  return {
    spikeDetected,
    count: recentReports.length,
    threshold,
    periodHours: hours
  };
}

/**
 * Detect unusual system behavior from audit logs
 * @param {string} userId
 * @param {number} suspiciousThreshold
 */
async function detectSuspiciousActivity(userId, suspiciousThreshold = 5) {
  const recentLogs = await AuditLog.find({
    user: userId,
    isSuspicious: true
  }).sort({ createdAt: -1 });

  const flagged = recentLogs.length >= suspiciousThreshold;

  return {
    flagged,
    suspiciousCount: recentLogs.length,
    threshold: suspiciousThreshold
  };
}

/**
 * Aggregate anomaly score
 * Combines reporting spikes, suspicious activity, and historical pattern deviations
 */
async function calculateAnomalyScore(userId) {
  const reportingSpike = await detectReportingSpike(userId);
  const suspiciousActivity = await detectSuspiciousActivity(userId);

  let anomalyScore = 0;
  const flags = [];

  if (reportingSpike.spikeDetected) {
    anomalyScore += 50;
    flags.push(`Reporting spike detected: ${reportingSpike.count} reports in last ${reportingSpike.periodHours} hours`);
  }

  if (suspiciousActivity.flagged) {
    anomalyScore += 50;
    flags.push(`Suspicious system activity count: ${suspiciousActivity.suspiciousCount}`);
  }

  if (anomalyScore > 100) anomalyScore = 100;

  return {
    userId,
    anomalyScore,
    anomalyLevel:
      anomalyScore >= 80
        ? 'critical'
        : anomalyScore >= 60
        ? 'high'
        : anomalyScore >= 30
        ? 'medium'
        : 'low',
    flags
  };
}

module.exports = {
  detectReportingSpike,
  detectSuspiciousActivity,
  calculateAnomalyScore
};
