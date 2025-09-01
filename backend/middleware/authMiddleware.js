const jwt = require('jsonwebtoken');
const db = require('../db/database');

const SECRET_KEY = '08a18ea48574549d7476c97ee6192d3e'; // Use the same secret key as in server.js

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, SECRET_KEY);

      db.get('SELECT id FROM users WHERE id = ?', [decoded.id], (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.userId = user.id;
        next();
      });
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
