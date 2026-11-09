const mongoose = require('mongoose');

const jobListSchema = new mongoose.Schema({
  srf_id: { type: String, unique: true, index: true }, 
  device_id: String,
  task: String,
  scn: String,
  min: String,
  imei: String,
  deviceType: String,
  devicesTypes: String,
  new_scn: String,
  new_min: String,
  new_imei: String,
  odometer: String,
  technician_remarks: String,
  plateNumber: {
    type: String,
    default: "N/A",
    trim: true
  },
  vehicleType: String,
  checklist: [
    {
      text: {
        type: String,
        required: true
      },
      done: {
        type: Boolean,
        default: false
      },
      remark: {
        type: String,
        default: ""
      }
    }
  ]
}, { _id: true }); // keeps jobListId for delete later

const joOrderSchema = new mongoose.Schema({
  jobOrder_id: { type: String, unique: true, index: true }, // JobOrder Numbers like JobOrder-00001
  status_id: {
    type: String,
    default: "For Approval",
    required: [true, "Status is required"],
  },
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
  date: { type: Date, default: Date.now },
  start_time: { type: String, default: null },
  end_time: { type: String, default: null },
  client_id: { label: String, value: String },
  location: String,
  contact: String,
  number: { type: String },
  technician: String,
  concern: String,
  gps_status: String,
  advisor: String,
  admin: String,
  inventory: String,
  serviceCoordinator: String,  
  remarks: String,
  serviceVehicle: { type: String, default: "Personal" },
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
  jobOrders: {
    type: [jobListSchema],
    default: []
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
  collection: 'job_orders'
});

module.exports = mongoose.model('jobOrder', joOrderSchema);
