/**
 * Hybrid Scam Shield AI
 * Pattern Correlation Engine
 *
 * Detects:
 * - Repeated phone numbers
 * - Repeated emails
 * - Repeated scam websites
 * - Similar linguistic patterns
 * - Financial clustering patterns
 */

const ScamReport = require('../models/ScamReport');

/**
 * Calculate text similarity using basic token overlap
 * (Extensible to cosine similarity / embeddings later)
 */
function calculateTextSimilarity(textA = '', textB = '') {
  const tokensA = new Set(textA.toLowerCase().split(/\W+/));
  const tokensB = new Set(textB.toLowerCase().split(/\W+/));

  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const similarity = intersection.size / Math.max(tokensA.size, 1);

  return similarity; // 0 → 1
}

/**
 * Correlate a new report against existing reports
 */
async function correlateReport(newReport) {
  const existingReports = await ScamReport.find({
    _id: { $ne: newReport._id }
  });

  const correlations = [];
  let clusterScore = 0;

  for (const report of existingReports) {

    let similarityScore = 0;
    let matchedFactors = [];

    // 1️⃣ Phone correlation
    if (
      newReport.contactInfoUsed?.phone &&
      report.contactInfoUsed?.phone &&
      newReport.contactInfoUsed.phone === report.contactInfoUsed.phone
    ) {
      similarityScore += 30;
      matchedFactors.push('Repeated phone number');
    }

    // 2️⃣ Email correlation
    if (
      newReport.contactInfoUsed?.email &&
      report.contactInfoUsed?.email &&
      newReport.contactInfoUsed.email === report.contactInfoUsed.email
    ) {
      similarityScore += 25;
      matchedFactors.push('Repeated email address');
    }

    // 3️⃣ Website correlation
    if (
      newReport.contactInfoUsed?.website &&
      report.contactInfoUsed?.website &&
      newReport.contactInfoUsed.website === report.contactInfoUsed.website
    ) {
      similarityScore += 25;
      matchedFactors.push('Repeated scam website');
    }

    // 4️⃣ Linguistic similarity
    const textSimilarity = calculateTextSimilarity(
      newReport.description,
      report.description
    );

    if (textSimilarity > 0.4) {
      similarityScore += 20;
      matchedFactors.push('High linguistic similarity');
    }

    if (similarityScore > 0) {
      correlations.push({
        reportId: report._id,
        similarityScore,
        matchedFactors
      });

      clusterScore += similarityScore;
    }
  }

  // Normalize cluster score
  const normalizedClusterRisk = Math.min(clusterScore / 5, 100);

  return {
    correlations,
    clusterRiskScore: normalizedClusterRisk,
    campaignDetected: normalizedClusterRisk > 70
  };
}

module.exports = { correlateReport };
