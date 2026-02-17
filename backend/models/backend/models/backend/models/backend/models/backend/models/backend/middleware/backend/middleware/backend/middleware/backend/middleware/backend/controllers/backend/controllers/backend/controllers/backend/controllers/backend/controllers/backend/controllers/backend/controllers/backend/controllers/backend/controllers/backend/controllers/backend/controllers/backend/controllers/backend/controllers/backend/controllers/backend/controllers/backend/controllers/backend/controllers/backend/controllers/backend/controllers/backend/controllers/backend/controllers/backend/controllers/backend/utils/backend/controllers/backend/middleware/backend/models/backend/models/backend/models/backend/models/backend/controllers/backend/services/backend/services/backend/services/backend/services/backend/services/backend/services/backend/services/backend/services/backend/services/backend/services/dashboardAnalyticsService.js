/**
 * Hybrid Scam Shield AI
 * Dashboard & Analytics Service
 *
 * Purpose:
 * - Aggregate data from multiple engines
 * - Prepare analytics for dashboards
 * - Provide structured API-ready data for visualization
 */

const { evaluateThreat } = require('./threatOrchestrator');
const { buildFraudNetworkGraph } = require('./fraudNetworkGraphBuilder');
const { processThreatForAlerts } = require('./autoAlertTriggerEngine');
const { calculateAnomalyScore } = require('./anomalyDetectionEngine');
const { computeUserRiskProfile } = require('./behavioralRiskAggregator');
const ScamReport = require('../models/ScamReport');
const Alert = require('../models/Alert');
const User = require('../models/User');

async function getDashboardOverview() {
  // 1️⃣ Aggregate overall threat statistics
  const reports = await ScamReport.find({});
  const alerts = await Alert.find({});
  const users = await User.find({});

  const threatData = [];

  for (const report of reports) {
    const threatAnalysis = await evaluateThreat(report, report.reportedBy);
    threatData.push({
      reportId: report._id,
      threatLevel: threatAnalysis.threatLevel,
      unifiedScore: threatAnalysis.unifiedScore,
      contentFlags: threatAnalysis.contentFlags
    });
  }

  // 2️⃣ Build fraud network graph
  const networkGraph = await buildFraudNetworkGraph();

  // 3️⃣ User risk profiles
  const userProfiles = [];
  for (const user of users) {
    const behavioralProfile = await computeUserRiskProfile(user._id);
    const anomalyProfile = await calculateAnomalyScore(user._id);

    userProfiles.push({
      userId: user._id,
      name: user.name,
      behavioralRisk: behavioralProfile.behavioralRiskLevel,
      anomalyLevel: anomalyProfile.anomalyLevel,
      flags: [...behavioralProfile.flags, ...anomalyProfile.flags]
    });
  }

  // 4️⃣ Alerts summary
  const alertsSummary = alerts.map(alert => ({
    alertId: alert._id,
    title: alert.title,
    severity: alert.severity,
    createdAt: alert.createdAt
  }));

  return {
    reports: threatData,
    networkGraph,
    userProfiles,
    alerts: alertsSummary,
    summary: {
      totalReports: reports.length,
      totalAlerts: alerts.length,
      totalUsers: users.length
    }
  };
}

module.exports = { getDashboardOverview };
