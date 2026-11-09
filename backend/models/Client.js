const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Client Name is required"] },
    location: String,
    contact_person: {
      type: String,
      required: [true, "Contact Person is required"],
    },
    client_Id: String,
    contact_no: String,
    tin: {
      type: String,
      required: [true, "TIN is required"],
    },
    installation_address: String,
    billing_address: String,
    reason_edit: String,
    reason_delete: String,
    created_by: { type: String, required: [true, "Created By is required"] },
    created_at: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'clients'
});

module.exports = mongoose.model('Client', clientSchema);
