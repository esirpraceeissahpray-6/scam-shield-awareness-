/**

* Scam Shield AI - Risk Scoring Engine
* Core logic for scam probability calculation
  */

const scamKeywords = [
"urgent",
"verify account",
"suspended",
"click here",
"bank alert",
"password",
"login now",
"limited time",
"won prize",
"free money"
];

const suspiciousPatterns = [
/http[s]?://[^\s]+/g,
/\d{10,}/g, // long phone numbers
/[A-Z]{5,}/g // excessive caps
];

function calculateRiskScore(message) {
let score = 0;

const lowerMessage = message.toLowerCase();

// 1. Keyword analysis
scamKeywords.forEach(keyword => {
if (lowerMessage.includes(keyword)) {
score += 10;
}
});

// 2. Pattern analysis
suspiciousPatterns.forEach(pattern => {
if (pattern.test(message)) {
score += 15;
}
});

// 3. Urgency detection
if (lowerMessage.includes("urgent") || lowerMessage.includes("immediately")) {
score += 20;
}

// 4. Fake authority detection
if (lowerMessage.includes("admin") || lowerMessage.includes("support team")) {
score += 10;
}

// Cap score at 100
if (score > 100) score = 100;

return {
riskScore: score,
level: getRiskLevel(score),
safe: score < 40
};
}

function getRiskLevel(score) {
if (score >= 70) return "HIGH_RISK";
if (score >= 40) return "MEDIUM_RISK";
return "LOW_RISK";
}

module.exports = calculateRiskScore;
