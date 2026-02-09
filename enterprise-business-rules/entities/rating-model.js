'use strict';

const { log } = require('../../interface-adapters/middlewares/loggers/logger');

module.exports = {
  makeRatingProductModel: ({ validateRatingModel }) =>
    async function makeProductRatingModelHandler({ errorHandlers, ...ratingData }) {
      const { InvalidPropertyError } = errorHandlers;
      try {
        const validatedRatingData = await validateRatingModel(ratingData, InvalidPropertyError);
        return Object.freeze(validatedRatingData);
      } catch (error) {
        log.error('Error from rating-model handler:', error.message);
        throw new Error(error.message);
      }
    },
};
