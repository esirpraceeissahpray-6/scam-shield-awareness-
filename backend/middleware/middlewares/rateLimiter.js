// middlewares/rateLimiter.js

const rateLimit = require("express-rate-limit");

/*
Rate Limiter Middleware

Purpose:
Limits how many requests a user can make
within a time window.

This protects:
- Scam report submissions
- Feedback submissions
- Login attempts
- API endpoints
*/

const reportLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 5, // Max 5 requests per IP per minute

  message: {
    success: false,
    message:
      "Too many submissions. Please wait a moment before trying again.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

module.exports = reportLimiter;
