
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); 
  }
}
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const sendSuccess = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({ success: true, message, ...data });
};

module.exports = { ApiError, asyncHandler, sendSuccess };