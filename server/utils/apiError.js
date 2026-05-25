class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Wrap async route handlers — eliminates try/catch boilerplate
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Standardised success response
const sendSuccess = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({ success: true, message, ...data });
};

module.exports = { ApiError, asyncHandler, sendSuccess };