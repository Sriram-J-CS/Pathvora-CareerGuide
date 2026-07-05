const jwt = require('jsonwebtoken');
const db = require('../db');

const protect = async (req, res, next) => {
  let token;

  // Support reading token from cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no session token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careeros-super-secret-key-2026');
    req.user = await db.getUserById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized, user profile not found' });
    }
    next();
  } catch (error) {
    console.error('JWT Token Verification Error:', error);
    return res.status(401).json({ error: 'Not authorized, session expired or invalid' });
  }
};

module.exports = { protect };
