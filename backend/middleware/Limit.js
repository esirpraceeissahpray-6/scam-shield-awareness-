/**

* Scam Shield AI - Behavioral Protection Layer
* (NOT a rate limiter - works AFTER rateLimiter.js)
  */

const limitMiddleware = (req, res, next) => {
try {
const ip = req.ip;
const now = Date.now();

```
if (!global._behaviorMap) {
  global._behaviorMap = new Map();
}

let data = global._behaviorMap.get(ip) || {
  requests: [],
  repeatCount: 0,
  penalty: 0,
  lastPayload: null
};

// Clean old requests (1 min window)
data.requests = data.requests.filter(t => now - t < 60000);

data.requests.push(now);

const bodyString = JSON.stringify(req.body || {});

// Detect repeated bot behavior
if (data.lastPayload === bodyString) {
  data.repeatCount++;
} else {
  data.repeatCount = 0;
}

data.lastPayload = bodyString;

// Behavioral penalty system
if (data.requests.length > 20) {
  data.penalty++;
}

if (data.repeatCount >= 5) {
  return res.status(403).json({
    success: false,
    message: "Automated behavior detected"
  });
}

if (data.penalty >= 5) {
  return res.status(403).json({
    success: false,
    message: "Temporary access blocked due to suspicious activity"
  });
}

global._behaviorMap.set(ip, data);

next();
```

} catch (error) {
console.error("Behavior limiter error:", error.message);

```
return res.status(500).json({
  success: false,
  message: "Security layer error"
});
```

}
};

module.exports = limitMiddleware;
