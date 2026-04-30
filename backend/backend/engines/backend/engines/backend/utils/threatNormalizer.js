/**

* Scam Shield AI - Threat Normalizer Engine
* Protects against adversarial AI inputs, obfuscation, and prompt injection
  */

function normalizeText(input) {
if (!input || typeof input !== "string") return "";

let text = input;

// 1. Remove zero-width characters (VERY IMPORTANT for AI attacks)
text = text.replace(/[\u200B-\u200D\uFEFF]/g, "");

// 2. Normalize unicode (prevents obfuscation like fr€e, cl1ck)
text = text.normalize("NFKC");

// 3. Convert to lowercase for consistent scoring
text = text.toLowerCase();

// 4. Remove excessive punctuation noise
text = text.replace(/[!@#$%^&*()_+=-{}[]|;:"'<>,.?/~`]/g, " ");

// 5. Collapse multiple spaces
text = text.replace(/\s+/g, " ").trim();

return text;
}

/**

* Detect prompt injection attempts
  */
  function detectInjectionPatterns(text) {
  const patterns = [
  /ignore previous instructions/i,
  /disregard (all|previous) rules/i,
  /act as (admin|system|root)/i,
  /override safety/i,
  /you are now/i
  ];

return patterns.some((pattern) => pattern.test(text));
}

/**

* Main export: sanitize + flag threat level
  */
  function threatNormalizer(message) {
  const cleaned = normalizeText(message);

const isInjection = detectInjectionPatterns(message);

return {
original: message,
cleanedMessage: cleaned,
injectionDetected: isInjection,
safeForScoring: !isInjection
};
}

module.exports = threatNormalizer;
