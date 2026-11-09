const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  // Support BOTH cookie + Bearer token
  const token = req.cookies?.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

  if (!token || token === 'undefined') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  Ensure req.user always exists
    req.user = decoded;

    next();
  } catch (err) {
    //  Clear cookie if invalid (browser case)
    if (req.cookies?.token) {
      res.clearCookie('token');
    }

    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    //  Ensure user exists before checking role
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    //  Role validation
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    next();
  };
};