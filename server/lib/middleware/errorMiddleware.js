const logger = require('../utils/logger');
const ResponseHandler = require('../utils/responseHandler');

class ErrorMiddleware {
  // Error handler middleware
  static errorHandler(err, req, res, next) {
    // Log the error
    logger.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => ({
        field: error.path,
        message: error.message
      }));
      return ResponseHandler.validationError(res, errors);
    }

    if (err.name === 'MongoError' && err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return ResponseHandler.conflict(res, `${field} already exists`);
    }

    if (err.name === 'JsonWebTokenError') {
      return ResponseHandler.unauthorized(res, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
      return ResponseHandler.unauthorized(res, 'Token expired');
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message;

    return ResponseHandler.error(res, message, statusCode);
  }

  // Async error wrapper (for catching async errors in routes)
  static catchAsync(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // Not found handler (should be placed after all routes)
  static notFound(req, res, next) {
    ResponseHandler.notFound(res, `Cannot ${req.method} ${req.originalUrl}`);
  }
}

module.exports = ErrorMiddleware;
