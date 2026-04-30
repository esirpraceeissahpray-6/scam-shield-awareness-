/**

* Scam Shield AI - CAPTCHA Validator Middleware (UPGRADED)
*
* Purpose:
* Verifies CAPTCHA tokens using Google reCAPTCHA
* to ensure requests are from real humans.
*
* Used for:
* * Scam report submissions
* * Message checking requests
* * User-generated inputs
    */

const axios = require("axios");

const captchaValidator = async (req, res, next) => {
try {
// Accept token from multiple sources (API flexibility)
const captchaToken =
req.body.captchaToken ||
req.headers["x-captcha-token"] ||
req.query.captchaToken;

```
// 1. Check token exists
if (!captchaToken) {
  return res.status(400).json({
    success: false,
    message: "CAPTCHA token is required"
  });
}

// 2. Check secret key exists (prevents silent deployment failure)
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

if (!secretKey) {
  console.error("Missing RECAPTCHA_SECRET_KEY in environment");
  return res.status(500).json({
    success: false,
    message: "Server CAPTCHA configuration error"
  });
}

// 3. Google verification (secure POST format)
const verificationURL = "https://www.google.com/recaptcha/api/siteverify";

const response = await axios.post(
  verificationURL,
  null,
  {
    params: {
      secret: secretKey,
      response: captchaToken
    }
  }
);

const data = response.data;

// 4. Reject invalid CAPTCHA
if (!data.success) {
  return res.status(403).json({
    success: false,
    message: "CAPTCHA verification failed",
    errorCodes: data["error-codes"] || []
  });
}

// 5. Passed CAPTCHA → continue pipeline
next();
```

} catch (error) {
console.error("CAPTCHA Validator Error:", error.message);

```
return res.status(500).json({
  success: false,
  message: "CAPTCHA validation failed internally"
});
```

}
};

module.exports = captchaValidator;
