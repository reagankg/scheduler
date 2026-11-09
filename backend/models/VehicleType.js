const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
    value: { type: String, required: [true, "Vehicle Type is required"] },
    reason_edit: String,
    reason_delete: String,
    created_by: { type: String, required: [true, "Created By is required"] },
    created_at: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'vehicle_types'
});

module.exports = mongoose.model('VehicleType', vehicleTypeSchema);