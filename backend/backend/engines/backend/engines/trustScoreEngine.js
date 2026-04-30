/**

* Scam Shield AI - Trust Score Engine
* Builds user reputation system for data integrity
  */

class TrustScoreEngine {
constructor() {
this.users = new Map();
}

/**

* Initialize user profile if not exists
  */
  initUser(userId) {
  if (!this.users.has(userId)) {
  this.users.set(userId, {
  reports: 0,
  validReports: 0,
  invalidReports: 0,
  trustScore: 50 // default neutral score
  });
  }

```
return this.users.get(userId);
```

}

/**

* Register a new scam report
  */
  registerReport(userId) {
  const user = this.initUser(userId);

```
user.reports += 1;
```

```
// small trust decay for high-frequency reporting (anti-spam)
if (user.reports > 20) {
  user.trustScore -= 2;
}

this.updateTrust(userId);

return user;
```

}

/**

* Mark report as valid (admin or system verification)
  */
  markValid(userId) {
  const user = this.initUser(userId);

```
user.validReports += 1;
```

```
this.updateTrust(userId);
```

}

/**

* Mark report as invalid (spam / false report)
  */
  markInvalid(userId) {
  const user = this.initUser(userId);

```
user.invalidReports += 1;
```

```
user.trustScore -= 10;

this.updateTrust(userId);
```

}

/**

* Calculate trust score dynamically
  */
  updateTrust(userId) {
  const user = this.users.get(userId);

```
if (!user) return;
```

```
let score = 50;

// reward good behavior
score += user.validReports * 5;

// punish bad behavior
score -= user.invalidReports * 10;

// normalize spam behavior
if (user.reports > 30) {
  score -= 15;
}

// clamp between 0 and 100
user.trustScore = Math.max(0, Math.min(100, score));
```

}

/**

* Get user trust score
  */
  getTrust(userId) {
  const user = this.initUser(userId);

```
return {
```

```
  userId,
  trustScore: user.trustScore,
  level: this.getLevel(user.trustScore)
};
```

}

/**

* Convert score to readable level
  */
  getLevel(score) {
  if (score >= 75) return "HIGH_TRUST";
  if (score >= 40) return "MEDIUM_TRUST";
  return "LOW_TRUST";
  }
  }

module.exports = new TrustScoreEngine();
