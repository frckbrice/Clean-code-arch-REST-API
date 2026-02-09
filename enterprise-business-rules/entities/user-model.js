'use strict';

const { log } = require('../../interface-adapters/middlewares/loggers/logger');

module.exports = {
  makeUserModel: ({ userValidationData, logEvents }) => {
    return async function makeUser({ userData, update = false }) {
      const { validateUserData, normalise, validateUserDataUpdates } = userValidationData;
      let normalisedUserData = {};
      try {
        const validatedUserData = update
          ? await validateUserDataUpdates({ ...userData })
          : await validateUserData({ ...userData });
        normalisedUserData = await normalise(validatedUserData);
        return Object.freeze(normalisedUserData);
      } catch (error) {
        log.error('Error from user-model handler:', error.message);
        logEvents(`${error.no}:${error.code}\t${error.name}\t${error.message}`, 'user-model.log');
        throw error;
      }
    };
  },
};
