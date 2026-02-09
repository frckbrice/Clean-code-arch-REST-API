'use strict';

const { log } = require('../../interface-adapters/middlewares/loggers/logger');

module.exports = {
  makeProductModel: ({ productValidation }) =>
    async function makeProductModelHandler({ productData, errorHandlers }) {
      const { basicProductValidation } = productValidation;
      try {
        const validatedProductData = await basicProductValidation({ productData, errorHandlers });
        return Object.freeze(validatedProductData);
      } catch (error) {
        log.error('Error from product-model handler:', error.message);
        throw new Error(error.message);
      }
    },
};
