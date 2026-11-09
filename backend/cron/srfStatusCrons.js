// cron/srfStatusCrons.js
const cron = require('node-cron');
const SRF = require('../models/SRF');

cron.schedule(
  '0 1 * * *', // Runs every day at 1:00 AM
  async () => {
    try {
      const now = new Date();

      const result = await SRF.updateMany(
        {
          status_id: 'Approved',
          date: {
            $lte: now
          }
        },
        {
          $set: {
            status_id: 'On-going'
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${result.modifiedCount} SRF(s) updated to On-going`);
      }

    } catch (err) {
      console.error('CRON ERROR:', err);
    }
  },
  {
    timezone: 'Asia/Manila'
  }
);