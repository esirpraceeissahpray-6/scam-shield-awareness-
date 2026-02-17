/**
 * Hybrid Scam Shield AI
 * External Threat Feed Integration Service
 *
 * Purpose:
 * - Fetch real-time external scam intelligence
 * - Normalize and deduplicate incoming data
 * - Integrate with Pattern Correlation and Auto Alert Engines
 */

const axios = require('axios');
const ScamReport = require('../models/ScamReport');
const { correlateReport } = require('./patternCorrelationEngine');
const { processThreatForAlerts } = require('./autoAlertTriggerEngine');
const AuditLog = require('../models/AuditLog');

/**
 * Fetch external threat feed
 * @param {string} feedUrl - URL of external threat feed (JSON/REST)
 */
async function fetchExternalFeed(feedUrl) {
  try {
    const response = await axios.get(feedUrl);
    return response.data; // Expecting array of external reports
  } catch (error) {
    console.error('Error fetching external feed:', error.message);
    return [];
  }
}

/**
 * Normalize external threat data into internal ScamReport format
 */
function normalizeExternalReport(externalReport) {
  return {
    title: externalReport.title || 'External Report',
    description: externalReport.description || '',
    reportedBy: null, // external source
    contactInfoUsed: externalReport.contactInfo || {},
    community: null,
    riskLevel: externalReport.riskLevel || 'medium',
    externalSource: externalReport.source || 'external_feed',
    createdAt: new Date(externalReport.createdAt || Date.now())
  };
}

/**
 * Process external reports into system
 * @param {Array} externalReports
 */
async function processExternalReports(externalReports) {
  for (const extReport of externalReports) {
    const normalizedReport = normalizeExternalReport(extReport);

    // 1️⃣ Save to database
    const reportDoc = await ScamReport.create(normalizedReport);

    // 2️⃣ Correlate with existing reports
    const correlationData = await correlateReport(reportDoc);

    // 3️⃣ Trigger auto alerts if necessary
    const alert = await processThreatForAlerts(
      {
        _id: reportDoc._id,
        description: reportDoc.description,
        contactInfoUsed: reportDoc.contactInfoUsed
      },
      null // external feed, no user ID
    );

    // 4️⃣ Audit log external ingestion
    await AuditLog.create({
      user: null,
      actorType: 'system',
      action: 'EXTERNAL_FEED_INGESTED',
      entityType: 'ScamReport',
      entityId: reportDoc._id,
      metadata: {
        externalSource: normalizedReport.externalSource,
        alertCreated: alert ? alert._id : null,
        correlationScore: correlationData.clusterRiskScore
      }
    });
  }
}

module.exports = {
  fetchExternalFeed,
  processExternalReports
};
