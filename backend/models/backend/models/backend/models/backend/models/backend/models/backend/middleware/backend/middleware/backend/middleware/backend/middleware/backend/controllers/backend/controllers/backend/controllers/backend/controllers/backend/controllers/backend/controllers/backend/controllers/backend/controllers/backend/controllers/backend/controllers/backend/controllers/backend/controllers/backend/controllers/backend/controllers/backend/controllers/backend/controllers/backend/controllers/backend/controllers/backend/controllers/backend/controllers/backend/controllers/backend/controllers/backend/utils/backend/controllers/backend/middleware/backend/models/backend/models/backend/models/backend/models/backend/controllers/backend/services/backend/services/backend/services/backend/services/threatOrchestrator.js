/**
 * Hybrid Scam Shield AI
 * Threat Orchestrator
 *
 * Central intelligence decision layer
 */

const { calculateRiskScore } = require('./aiRiskEngine');
const { correlateReport } = require('./patternCorrelationEngine');
const { computeUserRiskProfile } = require('./behavioralRiskAggregator');

async function evaluateThreat(report, userId) {

  // 1️⃣ Content Risk
  const contentAnalysis = calculateRiskScore(report.description);

  // 2️⃣ Pattern Correlation
  const correlationAnalysis = await correlateReport(report);

  // 3️⃣ Behavioral Risk
  const behavioralAnalysis = await computeUserRiskProfile(userId);

  // 🔥 Unified Threat Score
  let unifiedScore =
    (contentAnalysis.score * 0.5) +
    (correlationAnalysis.clusterRiskScore * 0.3) +
    (behavioralAnalysis.behavioralRiskScore * 0.2);

  if (unifiedScore > 100) unifiedScore = 100;

  const threatLevel =
    unifiedScore >= 80
      ? 'critical'
      : unifiedScore >= 60
      ? 'high'
      : unifiedScore >= 30
      ? 'medium'
      : 'low';

  return {
    unifiedScore,
    threatLevel,
    contentFlags: contentAnalysis.flags,
    correlationData: correlationAnalysis,
    behavioralFlags: behavioralAnalysis.flags
  };
}

module.exports = { evaluateThreat };
