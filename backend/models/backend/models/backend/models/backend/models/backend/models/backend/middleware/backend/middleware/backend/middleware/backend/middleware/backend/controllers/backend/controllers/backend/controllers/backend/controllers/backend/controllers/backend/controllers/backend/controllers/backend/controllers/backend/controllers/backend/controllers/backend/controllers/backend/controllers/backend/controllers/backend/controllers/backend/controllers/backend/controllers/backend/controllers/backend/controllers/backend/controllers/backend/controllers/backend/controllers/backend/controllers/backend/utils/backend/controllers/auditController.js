const AuditLog = require('../models/AuditLog');

// @desc    Create an audit log entry
// @param   {Object} param0 - { action, performedBy, target, details }
// @returns {Promise<AuditLog>}
const createAuditLog = async ({ action, performedBy, target, details }) => {
  try {
    const log = await AuditLog.create({
      action,
      performedBy: performedBy || null, // null if system/AI triggered
      target: target || null,
      details: details || '',
      timestamp: Date.now(),
    });
    return log;
  } catch (error) {
    console.error('Audit log creation failed:', error.message);
    return null;
  }
};

// @desc    Retrieve recent audit logs
// @param   {Number} limit - number of logs to retrieve
// @returns {Promise<Array<AuditLog>>}
const getRecentLogs = async (limit = 50) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ timestamp: -1 })
      .limit(limit);
    return logs;
  } catch (error) {
    console.error('Fetching audit logs failed:', error.message);
    return [];
  }
};

module.exports = {
  createAuditLog,
  getRecentLogs,
};
