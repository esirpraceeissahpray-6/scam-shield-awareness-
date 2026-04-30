// middlewares/captchaValidator.js

const axios = require("axios");

/*
CAPTCHA Validator Middleware

Purpose:
Verifies CAPTCHA tokens to ensure
submissions come from real humans.

Used for:
- Scam report submissions
- Feedback submissions
- User registrations
*/

const captchaValidator = async (req, res, next) => {
  try {
    const captchaToken = req.body.captchaToken;

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Captcha token is missing",
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const verificationURL =
      `https://www.google.com/recaptcha/api/siteverify` +
      `?secret=${secretKey}&response=${captchaToken}`;

    const response = await axios.post(verificationURL);

    if (!response.data.success) {
      return res.status(403).json({
        success: false,
        message: "Captcha verification failed",
      });
    }

    next();

  } catch (error) {
    console.error("Captcha validation error:", error);

    return res.status(500).json({
      success: false,
      message: "Captcha validation failed",
    });
  }
};

module.exports = captchaValidator;
