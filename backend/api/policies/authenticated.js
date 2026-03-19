const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  try {
    // Skip JWT check for public routes
    const publicRoutes = [
      // '/add_user',
      '/login',
      '/forget-password',
      '/forget-password-link',
      '/reset-login',
      '/passkey/login',
      '/passkey/login/verify',
      '/test-passkey-db',
      //'/passkey/register',
      '/contact-us',
      '/forget_password',
      '/forget_password_link/:tokan',
      '/reset_password'
    ];


    if (publicRoutes.includes(req.path)) {
      return next(); // allow public route
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({
        record: { status: 'error', status_code: 401, message: 'No token provided' }
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        record: { status: 'error', status_code: 401, message: 'Token missing' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    return next();
  } catch (err) {
    return res.status(403).json({
      record: { status: 'error', status_code: 403, message: 'Invalid or expired token' }
    });
  }
};
