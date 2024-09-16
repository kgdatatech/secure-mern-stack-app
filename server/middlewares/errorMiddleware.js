// server/middlewares/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    // Log the error stack for debugging purposes
    console.error(err.stack);
  
    // Set the status code, default to 500 if not specified
    const statusCode = err.status || 500;
  
    // Send the error response
    res.status(statusCode).json({
      message: err.message || 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.stack : {}, // Show stack trace only in development mode
    });
  };
  
  module.exports = errorMiddleware;
  