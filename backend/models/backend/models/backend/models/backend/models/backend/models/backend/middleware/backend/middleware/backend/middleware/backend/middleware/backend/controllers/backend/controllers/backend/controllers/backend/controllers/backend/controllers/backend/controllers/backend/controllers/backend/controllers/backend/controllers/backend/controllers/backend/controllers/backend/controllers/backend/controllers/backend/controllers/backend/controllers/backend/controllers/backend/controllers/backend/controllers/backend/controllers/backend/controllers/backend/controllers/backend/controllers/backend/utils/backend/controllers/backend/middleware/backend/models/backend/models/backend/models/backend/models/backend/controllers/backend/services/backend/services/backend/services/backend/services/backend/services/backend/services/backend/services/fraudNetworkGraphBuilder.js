/**
 * Hybrid Scam Shield AI
 * Fraud Network Graph Builder
 *
 * Purpose:
 * - Visualize connections between reports, users, alerts, and communities
 * - Identify central nodes (repeat offenders)
 * - Detect coordinated campaigns
 * - Support predictive intelligence and admin dashboards
 */

const ScamReport = require('../models/ScamReport');
const Alert = require('../models/Alert');
const Community = require('../models/Community');

/**
 * Build graph nodes and edges for fraud network
 */
async function buildFraudNetworkGraph() {
  const reports = await ScamReport.find({})
    .populate('reportedBy', 'name email')
    .populate('community', 'name');

  const alerts = await Alert.find({});
  const communities = await Community.find({});

  const nodes = new Map();
  const edges = [];

  // Add users and reports as nodes
  reports.forEach(report => {
    const userId = report.reportedBy._id.toString();
    const reportId = report._id.toString();

    if (!nodes.has(userId)) nodes.set(userId, { id: userId, label: report.reportedBy.name, type: 'user' });
    if (!nodes.has(reportId)) nodes.set(reportId, { id: reportId, label: report.title, type: 'report' });

    edges.push({ from: userId, to: reportId, relation: 'submitted' });

    if (report.community) {
      const communityId = report.community._id.toString();
      if (!nodes.has(communityId)) nodes.set(communityId, { id: communityId, label: report.community.name, type: 'community' });
      edges.push({ from: reportId, to: communityId, relation: 'belongs_to' });
    }
  });

  // Add alerts as nodes
  alerts.forEach(alert => {
    const alertId = alert._id.toString();
    if (!nodes.has(alertId)) nodes.set(alertId, { id: alertId, label: alert.title, type: 'alert' });

    if (alert.relatedReport) {
      const reportId = alert.relatedReport.toString();
      edges.push({ from: reportId, to: alertId, relation: 'triggered_alert' });
    }
  });

  return {
    nodes: Array.from(nodes.values()),
    edges
  };
}

module.exports = { buildFraudNetworkGraph };
