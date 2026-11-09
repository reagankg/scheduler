// middleware/auditLog.js
const jwt = require('jsonwebtoken');
const AuditLog = require('../models/Audit');
const User = require('../models/User');

const createAuditLog = (module, action) => {
  return async (req, res, next) => {
    const token = req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
          ? req.headers.authorization.split(' ')[1]
          : null);

    if (!token || token === 'undefined') {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const originalJson = res.json;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('firstName lastName');
    res.json = async function (body) {

      try {
        const auditUser = user ? `${user.firstName} ${user.lastName}` : body?.user
              ? `${body.user.firstName} ${body.user.lastName}`
              : 'Guest';

        await AuditLog.create({
          user: auditUser,
          description: req.body?.description,
          module,
          action
        });

      } catch (err) {
        console.error('Audit Log Error:', err);
      }

      return originalJson.call(this, body);
    };

    next();
  };
};


module.exports = {
  createAuditLog
};