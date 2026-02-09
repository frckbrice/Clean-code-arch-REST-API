'use strict';

const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';
const LOGS_DIR = path.join(__dirname, '..', 'logs');

/**
 * No-op function used when logging is disabled (production).
 * @returns {Promise<void>}
 */
const noop = () => Promise.resolve();

/**
 * Writes a log entry to a file. Only runs in development; no-op in production.
 * @param {string} message - Message to log.
 * @param {string} logFileName - Log file name (e.g. 'reqLog.log').
 * @returns {Promise<void>}
 */
async function logEvents(message, logFileName) {
  if (!isDevelopment) return noop();
  const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      await fsPromises.mkdir(LOGS_DIR, { recursive: true });
    }
    await fsPromises.appendFile(path.join(LOGS_DIR, logFileName), logItem);
  } catch (err) {
    process.stdout.write(`Logger write error: ${err.message}\n`);
  }
}

/**
 * Request logging middleware. Logs method and path only in development.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 */
function requestLogger(req, res, next) {
  if (isDevelopment) {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin || ''}`, 'reqLog.log');
    process.stdout.write(`${req.method} ${req.path}\n`);
  }
  next();
}

/**
 * Development-only log helpers. In production all methods are no-ops.
 */
const log = isDevelopment
  ? {
      info: (...args) => process.stdout.write(args.map(String).join(' ') + '\n'),
      error: (...args) => process.stderr.write(args.map(String).join(' ') + '\n'),
      warn: (...args) => process.stderr.write(args.map(String).join(' ') + '\n'),
      debug: (...args) => process.stdout.write(args.map(String).join(' ') + '\n'),
    }
  : {
      info: () => {},
      error: () => {},
      warn: () => {},
      debug: () => {},
    };

module.exports = { logEvents, logger: requestLogger, log, isDevelopment };
