/**
 * Hybrid Scam Shield AI
 * Behavioral Risk Aggregator
 *
 * Purpose:
 * - Build dynamic user risk profile
 * - Detect abnormal reporting behavior
 * - Identify malicious reporters
 * - Detect potential internal abuse
 */

const ScamReport = require('../models/ScamReport');
const AuditLog = require('../models/AuditLog');

async function computeUserRiskProfile(userId) {
  const reports = await ScamReport.find({ reportedBy: userId });
  const auditLogs = await AuditLog.find({ user: userId });

  let riskScore = 0;
  let flags = [];

  // 1️⃣ High frequency reporting anomaly
  if (reports.length > 20) {
    riskScore += 20;
    flags.push('Unusually high reporting frequency');
  }

  // 2️⃣ High false report ratio
  const falseReports = reports.filter(r => r.status === 'false_report');
  if (reports.length > 5 && falseReports.length / reports.length > 0.4) {
    riskScore += 30;
    flags.push('High false-report ratio detected');
  }

  // 3️⃣ Repeated suspicious login attempts
  const suspiciousLogs = auditLogs.filter(log => log.isSuspicious);
  if (suspiciousLogs.length > 5) {
    riskScore += 25;
    flags.push('Repeated suspicious activity');
  }

  // 4️⃣ Escalated critical report pattern
  const criticalReports = reports.filter(r => r.riskLevel === 'critical');
  if (criticalReports.length > 10) {
    riskScore += 15;
    flags.push('Frequent critical-risk submissions');
  }

  if (riskScore > 100) riskScore = 100;

  return {
    userId,
    behavioralRiskScore: riskScore,
    behavioralRiskLevel:
      riskScore >= 80
        ? 'critical'
        : riskScore >= 60
        ? 'high'
        : riskScore >= 30
        ? 'medium'
        : 'low',
    flags
  };
}

module.exports = { computeUserRiskProfile };
