'use strict';

const { logEvents, log, isDevelopment } = require('./logger');

/**
 * Express error handler. Logs errors only in development; always returns JSON response.
 * @param {Error} err - Error object.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 */
function errorHandler(err, req, res, next) {
  if (isDevelopment) {
    logEvents(
      `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin || ''}`,
      'errLog.log'
    );
    log.error(err.stack);
  }
  const status = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status);
  res.json({ message: err.message });
  next(err);
}

module.exports = errorHandler;
