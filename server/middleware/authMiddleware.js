const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');
const JWT_SECRET = require("../comfig");

class AuthMiddleware {
  // Protect routes - requires valid JWT
  static protect = async (req, res, next) => {
    try {
      let token;
      
      // Get token from header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      
      if (!token) {
        return ResponseHandler.unauthorized(res, 'You are not logged in. Please log in to access this resource.');
      }
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if user still exists
      const user = await User.findById(decoded.id).select('+passwordChangedAt');
      
      if (!user) {
        return ResponseHandler.unauthorized(res, 'The user belonging to this token no longer exists.');
      }
      
      // Check if user changed password after token was issued
      if (user.changedPasswordAfter(decoded.iat)) {
        return ResponseHandler.unauthorized(res, 'User recently changed password. Please log in again.');
      }
      
      // Check if user is verified
      if (!user.isVerified) {
        return ResponseHandler.unauthorized(res, 'Please verify your email address to access this resource.');
      }
      
      // Grant access to protected route
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return ResponseHandler.unauthorized(res, 'Invalid token. Please log in again.');
      }
      
      if (error.name === 'TokenExpiredError') {
        return ResponseHandler.unauthorized(res, 'Your token has expired. Please log in again.');
      }
      
      logger.error('Auth middleware error:', error);
      return ResponseHandler.unauthorized(res, 'Authentication failed.');
    }
  };

  // Restrict to specific roles
  static restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return ResponseHandler.forbidden(res, 'You do not have permission to perform this action.');
      }
      next();
    };
  };

  // Optional authentication (doesn't fail if no token)
  static optional = async (req, res, next) => {
    try {
      let token;
      
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        
        if (token) {
          const decoded = jwt.verify(token, JWT_SECRET);
          const user = await User.findById(decoded.id);
          
          if (user && !user.changedPasswordAfter(decoded.iat)) {
            req.user = user;
          }
        }
      }
      
      next();
    } catch (error) {
      // Just continue without user if token is invalid
      next();
    }
  };

  // Check if user is verified
  static requireVerified = (req, res, next) => {
    if (!req.user || !req.user.isVerified) {
      return ResponseHandler.unauthorized(res, 'Please verify your email address to access this resource.');
    }
    next();
  };
}

module.exports = AuthMiddleware;
