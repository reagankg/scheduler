const mongoose = require('mongoose');

const srfSchema = new mongoose.Schema({
  srf_id: { type: String, unique: true, index: true }, // SRF Numbers like SRF-00001
  status_id: {
    type: String,
    default: "For Approval",
    required: [true, "Status is required"],
  },
  device_id: String,
  withNotes: { type: Boolean, default: false },
  notes: String,
  withCancel: { type: Boolean, default: false },
  cancelNotes: String,
  clientTitle: String,
  clientSignature: {
    url: String,
    signedAt: Date,
    signedBy: String
  },
  scn: String,
  min: String,
  imei: String,
  deviceType: String,
  devicesTypes: String,
  new_scn: String,
  new_min: String,
  new_imei: String,
  plateNumber: {
    type: String,
    default: "N/A",
    trim: true
  },
  vehicleType: String,
  date: { type: Date, default: Date.now },
  client_id: { label: String, value: String },
  location: String,
  contact: String,
  number: { type: String },
  technician: String,
  task: String,
  concern: String,
  odometer: String,
  gps_status: String,
  advisor: String,
  admin: String,
  inventory: String,
  serviceCoordinator: String,
  technician_remarks: String,
  remarks: String,
  serviceVehicle: { type: String, default: "Personal" },
  checklist: [
    {
      text: String,
      done: { type: Boolean, default: false },
      remark: { type: String, default: "" },
      text: {
        type: String,
      },
      remark: {
        type: String,
      },
      done: {
        type: Boolean,
        default: false
      }
    }
  ],
  acknowledged_by: String,
  checked_by: String,
  

  completion_date_time: Date,
  // gps_status_id: mongoose.Schema.Types.ObjectId,
  // system_system_admin_id: {
  //   type: String,
  //   required: [true, "System system_admin is required"],
  // },
  // service_coordinator_id: {
  //   type: String,
  //   required: [true, "Service Coordinator is required"],
  // },
  archived: { type: Boolean, default: false },
  reason_edit: String,
  reason_delete: String,
  created_by: { type: String, required: [true, "Created By is required"] },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  closed_date_time: Date,
  sc_comment: String,
  om_comment: String,
  title: {
    type: String,
  },
  sections: [
    {
      sectionTitle: {
        type: String,
      },
      remarks: {
        type: String,
        default: ''
      },
      options: [
        {
          label: {
            type: String,
          },
          isChecked: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ]
}, {
  timestamps: true,
  collection: 'installations'
});

module.exports = mongoose.model('Installation', srfSchema);
