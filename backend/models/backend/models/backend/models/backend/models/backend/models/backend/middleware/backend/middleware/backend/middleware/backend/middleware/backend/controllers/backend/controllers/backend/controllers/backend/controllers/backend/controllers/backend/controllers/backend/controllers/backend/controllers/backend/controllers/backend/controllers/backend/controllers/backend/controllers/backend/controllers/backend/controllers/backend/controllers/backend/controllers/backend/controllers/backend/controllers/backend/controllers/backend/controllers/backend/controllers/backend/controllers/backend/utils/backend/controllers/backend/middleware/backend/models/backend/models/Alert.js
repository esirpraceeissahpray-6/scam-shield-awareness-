const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },

    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
    },

    alertType: {
      type: String,
      enum: [
        'scam_warning',
        'system_notice',
        'high_risk_alert',
        'community_alert',
        'regulatory_notice'
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },

    targetAudience: {
      type: String,
      enum: ['all', 'users', 'admins', 'community_members'],
      default: 'all',
    },

    relatedReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScamReport',
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Auto-disable expired alerts
alertSchema.pre('save', function (next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.isActive = false;
  }
  next();
});

module.exports = mongoose.model('Alert', alertSchema);
