const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    // Actor Information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = system/AI action
    },

    actorType: {
      type: String,
      enum: ['user', 'admin', 'system', 'ai_engine'],
      required: true,
    },

    // Action Metadata
    action: {
      type: String,
      required: true, // e.g., CREATE_REPORT, UPDATE_STATUS, LOGIN_SUCCESS
    },

    entityType: {
      type: String,
      enum: [
        'User',
        'ScamReport',
        'Community',
        'Alert',
        'ChatMessage',
        'System'
      ],
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Technical Traceability
    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    metadata: {
      type: Object,
      default: {},
    },

    // Security Flags
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },

    isSuspicious: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Optional index for faster compliance queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ entityType: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
