// models/AuditLog.js

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: String,
  },

  action: {
    type: String,
  },

  module: {
    type: String,
  },

  description: {
    type: String,
  },

  ip_address: String,

  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('AuditLog', auditLogSchema)