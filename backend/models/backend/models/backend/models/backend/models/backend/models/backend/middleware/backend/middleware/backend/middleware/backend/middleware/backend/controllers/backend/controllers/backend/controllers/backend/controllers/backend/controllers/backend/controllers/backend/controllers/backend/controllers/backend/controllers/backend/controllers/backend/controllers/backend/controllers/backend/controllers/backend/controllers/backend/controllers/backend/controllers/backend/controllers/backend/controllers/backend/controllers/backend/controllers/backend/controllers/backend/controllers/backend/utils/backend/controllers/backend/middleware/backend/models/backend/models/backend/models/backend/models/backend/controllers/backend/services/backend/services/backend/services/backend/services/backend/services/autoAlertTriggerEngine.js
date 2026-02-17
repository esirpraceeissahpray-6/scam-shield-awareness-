/**
 * Hybrid Scam Shield AI
 * Auto Alert Trigger Engine
 *
 * Purpose:
 * - Automatically create alerts
 * - Escalate coordinated scam campaigns
 * - Notify admins of critical threats
 */

const Alert = require('../models/Alert');
const AuditLog = require('../models/AuditLog');

async function processThreatForAlerts(threatAnalysis, report, userId) {

  const { unifiedScore, threatLevel, correlationData } = threatAnalysis;

  let alertCreated = null;

  // 1️⃣ Critical Threat Alert
  if (threatLevel === 'critical') {
    alertCreated = await Alert.create({
      title: 'Critical Scam Threat Detected',
      message: `A scam report has been classified as CRITICAL (Score: ${unifiedScore}). Immediate review required.`,
      alertType: 'high_risk_alert',
      severity: 'critical',
      targetAudience: 'admins',
      relatedReport: report._id,
      createdBy: userId
    });
  }

  // 2️⃣ Coordinated Campaign Detection
  if (correlationData.campaignDetected) {
    alertCreated = await Alert.create({
      title: 'Coordinated Scam Campaign Detected',
      message: 'Multiple correlated reports indicate an organized scam network.',
      alertType: 'scam_warning',
      severity: 'high',
      targetAudience: 'all',
      relatedReport: report._id,
      createdBy: userId
    });
  }

  // 3️⃣ Medium Escalation Threshold
  if (unifiedScore >= 60 && unifiedScore < 80) {
    alertCreated = await Alert.create({
      title: 'Elevated Scam Risk Identified',
      message: `This report has a high risk profile (Score: ${unifiedScore}). Monitoring initiated.`,
      alertType: 'community_alert',
      severity: 'high',
      targetAudience: 'community_members',
      relatedReport: report._id,
      createdBy: userId
    });
  }

  // Audit logging if alert created
  if (alertCreated) {
    await AuditLog.create({
      user: userId,
      actorType: 'system',
      action: 'AUTO_ALERT_TRIGGERED',
      entityType: 'Alert',
      entityId: alertCreated._id,
      metadata: {
        unifiedScore,
        threatLevel
      }
    });
  }

  return alertCreated;
}

module.exports = { processThreatForAlerts };
