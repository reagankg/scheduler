const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  startDate: { type: String, required: true }, // YYYY-MM-DD
  endDate:   { type: String, required: true }, // YYYY-MM-DD
  reason:    { type: String, default: '' }
}, { _id: true }); // keeps leaveId for delete later

const dayOffSchema = new mongoose.Schema({
  dayOffDate: { type: String, required: true }, // YYYY-MM-DD
  reason:    { type: String, default: 'Rescheduled Day Off' }
}, { _id: true }); // keeps dayoffId for delete later

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  initialPassword: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['developer','operations_manager', 'system_admin', 'service_coordinator', 'technician'], 
    default: 'service_coordinator' 
  },
  special: { type: Boolean, default: false },
  password: { type: String, required: true },
  dayOff: {
    type: [Number],
    default: [0],
    validate: {
      validator: arr => arr.every(d => d >= 0 && d <= 6),
      message: 'dayOff must contain values between 0 and 6'
    }
  },
  dayOffHistory: [
    {
      from: {
        type: [Number],
        default: []
      },
      to: {
        type: [Number],
        default: []
      },
      changedAt: {
        type: Date,
        default: Date.now
      },
      changedBy: String
    }
  ],
  leaves: {
    type: [leaveSchema],
    default: []
  },
  specialDayOff: {
    type: [dayOffSchema],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);