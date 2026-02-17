/**
 * Hybrid Scam Shield AI - Risk Engine
 * Production-ready scoring system (extensible to ML integration)
 */

const scamKeywords = {
  highRisk: [
    'urgent transfer',
    'send money now',
    'crypto investment',
    'guaranteed profit',
    'double your money',
    'verify your account immediately',
    'limited time offer',
    'lottery winner',
    'click this link',
    'bank verification'
  ],
  impersonation: [
    'ceo',
    'government official',
    'police officer',
    'bank manager',
    'safaricom agent',
    'irs',
    'support team'
  ],
  financialTriggers: [
    'wire transfer',
    'bitcoin',
    'usdt',
    'gift card',
    'mpesa',
    'western union'
  ]
};

function calculateRiskScore(description = '') {
  let score = 0;
  const flags = [];
  const text = description.toLowerCase();

  // High-Risk Phrase Detection
  scamKeywords.highRisk.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 15;
      flags.push(`High-risk phrase detected: "${keyword}"`);
    }
  });

  // Impersonation Detection
  scamKeywords.impersonation.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 10;
      flags.push(`Impersonation pattern: "${keyword}"`);
    }
  });

  // Financial Trigger Detection
  scamKeywords.financialTriggers.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 12;
      flags.push(`Financial trigger: "${keyword}"`);
    }
  });

  // Length-based anomaly boost
  if (description.length > 500) {
    score += 5;
    flags.push('Long structured persuasion text detected');
  }

  // Cap at 100
  if (score > 100) score = 100;

  return {
    score,
    riskLevel:
      score >= 80
        ? 'critical'
        : score >= 60
        ? 'high'
        : score >= 30
        ? 'medium'
        : 'low',
    flags
  };
}

module.exports = { calculateRiskScore };
