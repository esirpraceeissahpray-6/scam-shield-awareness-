/**
 * Hybrid Scam Shield AI
 * Escalation & Enforcement Engine
 *
 * Purpose:
 * - Automatically apply restrictions to high-risk users
 * - Freeze or throttle accounts showing malicious behavior
 * - Integrate with Threat Orchestrator & Anomaly Detection
 */

const User = require('../models/User');
const { evaluateThreat } = require('./threatOrchestrator');
const { calculateAnomalyScore } = require('./anomalyDetectionEngine');
const AuditLog = require('../models/AuditLog');

/**
 * Enforce actions based on combined threat and anomaly scores
 * @param {Object} report - Scam report object
 * @param {string} userId - ID of user submitting report
 */
async function enforceUserActions(report, userId) {
  // 1️⃣ Evaluate unified threat
  const threatAnalysis = await evaluateThreat(report, userId);

  // 2️⃣ Evaluate anomaly
  const anomalyAnalysis = await calculateAnomalyScore(userId);

  let actionsTaken = [];

  // 3️⃣ Critical threat escalation
  if (threatAnalysis.threatLevel === 'critical' || anomalyAnalysis.anomalyLevel === 'critical') {
    // Freeze user
    await User.findByIdAndUpdate(userId, { isFrozen: true });
    actionsTaken.push('Account frozen due to critical threat/anomaly');

    await AuditLog.create({
      user: userId,
      actorType: 'system',
      action: 'ACCOUNT_FROZEN',
      entityType: 'User',
      entityId: userId,
      metadata: {
        threatScore: threatAnalysis.unifiedScore,
        anomalyScore: anomalyAnalysis.anomalyScore
      }
    });
  }

  // 4️⃣ High threat / anomaly throttling
  else if (threatAnalysis.threatLevel === 'high' || anomalyAnalysis.anomalyLevel === 'high') {
    // Throttle user actions (example: limit submissions)
    await User.findByIdAndUpdate(userId, { submissionThrottle: true });
    actionsTaken.push('Account throttled due to high threat/anomaly');

    await AuditLog.create({
      user: userId,
      actorType: 'system',
      action: 'ACCOUNT_THROTTLED',
      entityType: 'User',
      entityId: userId,
      metadata: {
        threatScore: threatAnalysis.unifiedScore,
        anomalyScore: anomalyAnalysis.anomalyScore
      }
    });
  }

  // 5️⃣ Medium threat – monitoring only
  else if (threatAnalysis.threatLevel === 'medium' || anomalyAnalysis.anomalyLevel === 'medium') {
    actionsTaken.push('User flagged for monitoring (medium threat/anomaly)');

    await AuditLog.create({
      user: userId,
      actorType: 'system',
      action: 'USER_FLAGGED',
      entityType: 'User',
      entityId: userId,
      metadata: {
        threatScore: threatAnalysis.unifiedScore,
        anomalyScore: anomalyAnalysis.anomalyScore
      }
    });
  }

  return {
    threatLevel: threatAnalysis.threatLevel,
    anomalyLevel: anomalyAnalysis.anomalyLevel,
    actionsTaken
  };
}

module.exports = { enforceUserActions };
