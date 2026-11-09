const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
value: { type: String, required: [true, "Task value is required"] },
reason_edit: String,
reason_delete: String,
created_by: { type: String, required: [true, "Created By is required"] },
created_at: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'tasks'
});

module.exports = mongoose.model('Task', taskSchema);