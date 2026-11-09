const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    date_added: { type: Date, default: Date.now },
    device_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Device Type is required"],
    },
    imei: String,
    tid: String,
    min: String,
    scn: String,
    client_id: mongoose.Schema.Types.ObjectId,
    archived: { type: Boolean, default: false },
    reason_edit: String,
    reason_delete: String,
    created_by: { type: String, required: [true, "Created By is required"] },
    created_at: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'devices'
});

module.exports = mongoose.model('Device', deviceSchema);
