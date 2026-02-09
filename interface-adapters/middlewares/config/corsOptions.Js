'use strict';

const { allowedOrigin } = require('./allowedOrigin');
const { log } = require('../loggers/logger');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.includes(origin) || !origin) {
      log.debug('CORS allowed:', origin || 'no origin');
      callback(null, true);
    } else {
      log.warn('CORS blocked origin:', origin);
      callback(new Error('NOT ALLOW BECAUSE OF CORS'));
    }
  },
  optionSuccessStatus: 200,
  credentials: true,
};

module.exports = corsOptions;
