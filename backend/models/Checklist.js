const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  created_by: {   // ✅ store author name or ID
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
          },
        }
      ]
    }
  ]
}, {
  timestamps: true,
  collection: 'compliancelists'
});

module.exports = mongoose.model('Checklist', checklistSchema);