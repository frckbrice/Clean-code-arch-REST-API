'use strict';

const MongoClient = require('mongodb').MongoClient;
const {
  MongoServerSelectionError,
  MongoServerClosedError,
  MongoServerError,
  MongoNetworkError,
} = require('mongodb');
const { logEvents, log } = require('../middlewares/loggers/logger');

/**
 * Establishes a connection to the MongoDB database and returns a reference to the database.
 * @returns {Promise<import('mongodb').Db>} A promise that resolves to the MongoDB database instance.
 */
async function dbconnection() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
  } catch (err) {
    log.error('error connecting to database', err.message);
    if (
      err instanceof MongoServerSelectionError ||
      err instanceof MongoServerClosedError ||
      err instanceof MongoServerError ||
      err instanceof MongoNetworkError
    ) {
      logEvents(
        `${err.no || ''}:${err.message}\t${err.syscall || ''}\t${err.hostname || ''}`,
        'mongoErrLog.log'
      );
    }
    throw err;
  }
  const datastoreName = process.env.MONGO_DB_NAME || 'cleanarchdb';
  return client.db(datastoreName);
}

module.exports = { dbconnection };
