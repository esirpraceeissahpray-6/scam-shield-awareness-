const mongoose = require('mongoose');

const scamReportSchema = new mongoose.Schema(
  {
    // Basic Report Information
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
    },

    scamType: {
      type: String,
      enum: [
        'phishing',
        'investment',
        'romance',
        'impersonation',
        'job_offer',
        'lottery',
        'crypto',
        'loan',
        'other'
      ],
      required: true,
    },

    // Evidence & Metadata
    evidenceLinks: [
      {
        type: String,
        trim: true,
      }
    ],

    contactInfoUsed: {
      phone: { type: String, default: null },
      email: { type: String, default: null },
      website: { type: String, default: null }
    },

    amountLost: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: 'USD',
    },

    // AI Risk Scoring
    aiRiskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },

    aiFlags: [
      {
        type: String,
      }
    ],

    // Status Tracking
    status: {
      type: String,
      enum: [
        'pending',
        'under_review',
        'verified_scam',
        'false_report',
        'resolved'
      ],
      default: 'pending',
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // User Relationship
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      default: null,
    },

    isPublic: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Automatic Risk Level Calculation Before Save
scamReportSchema.pre('save', function (next) {
  if (this.aiRiskScore >= 80) this.riskLevel = 'critical';
  else if (this.aiRiskScore >= 60) this.riskLevel = 'high';
  else if (this.aiRiskScore >= 30) this.riskLevel = 'medium';
  else this.riskLevel = 'low';

  next();
});

module.exports = mongoose.model('ScamReport', scamReportSchema);
