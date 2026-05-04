/**

* Scam Shield AI - Trust Score Engine (UPGRADED)
* Advanced user reputation + anti-abuse system
  */

class TrustScoreEngine {
constructor() {
this.users = new Map();
}

initUser(userId) {
if (!this.users.has(userId)) {
this.users.set(userId, {
reports: 0,
validReports: 0,
invalidReports: 0,
lastReportTime: null,
trustScore: 50
});
}

```
return this.users.get(userId);
```

}

registerReport(userId) {
const user = this.initUser(userId);
const now = Date.now();

```
user.reports++;

// Detect spam frequency (rapid submissions)
if (user.lastReportTime && now - user.lastReportTime < 5000) {
  user.trustScore -= 3; // rapid-fire penalty
}

user.lastReportTime = now;

this.updateTrust(userId);

return user;
```

}

markValid(userId) {
const user = this.initUser(userId);
user.validReports++;
this.updateTrust(userId);
}

markInvalid(userId) {
const user = this.initUser(userId);
user.invalidReports++;
user.trustScore -= 10;
this.updateTrust(userId);
}

updateTrust(userId) {
const user = this.users.get(userId);
if (!user) return;

```
let score = 50;

// Positive contribution
score += user.validReports * 6;

// Negative contribution
score -= user.invalidReports * 12;

// High volume penalty (anti spam)
if (user.reports > 25) {
  score -= 10;
}

// Normalize
user.trustScore = Math.max(0, Math.min(100, score));
```

}

getTrust(userId) {
const user = this.initUser(userId);

```
return {
  userId,
  trustScore: user.trustScore,
  level: this.getLevel(user.trustScore),
  stats: {
    reports: user.reports,
    validReports: user.validReports,
    invalidReports: user.invalidReports
  }
};
```

}

getLevel(score) {
if (score >= 75) return "HIGH_TRUST";
if (score >= 40) return "MEDIUM_TRUST";
return "LOW_TRUST";
}
}

module.exports = new TrustScoreEngine();
