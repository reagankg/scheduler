const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    _id: { type: Number, required: [true, "Vehicle Id is required"] },
    value: { type: String, required: [true, "Vehicle is required"] },
    created_by: { type: String, required: [true, "Created By is required"] },
    created_at: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'vehicles'
});

module.exports = mongoose.model('Vehicle', vehicleSchema);