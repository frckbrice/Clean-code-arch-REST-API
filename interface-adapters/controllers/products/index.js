const {
  createProductController,
  findAllProductController,
  findOneProductController,
  updateProductController,
  deleteProductController,
  rateProductController,
  // findBestUserRaterController
} = require('./product-controller');

const {
  createProductUseCaseHandler,
  findAllProductUseCaseHandler,
  findOneProductUseCaseHandler,
  updateProductUseCaseHandler,
  deleteProductUseCaseHandler,
  rateProductUseCaseHandler,
} = require('../../../application-business-rules/use-cases/products');
const { makeHttpError } = require('../../validators-errors/http-error');

const errorHandlers = require('../../validators-errors/errors');
const { logEvents } = require('../../middlewares/loggers/logger');
const { dbProductHandler } = require('../../database-access');

const createProductControllerHandler = createProductController({
  createProductUseCaseHandler,
  dbProductHandler,
  errorHandlers,
  makeHttpError,
  logEvents,
});
const updateProductControllerHandler = updateProductController({
  dbProductHandler,
  updateProductUseCaseHandler,
  makeHttpError,
  logEvents,
  errorHandlers,
});
const deleteProductControllerHandler = deleteProductController({
  dbProductHandler,
  deleteProductUseCaseHandler,
  makeHttpError,
  logEvents,
  errorHandlers,
});
const findAllProductControllerHandler = findAllProductController({
  dbProductHandler,
  findAllProductUseCaseHandler,
  logEvents,
});
const findOneProductControllerHandler = findOneProductController({
  dbProductHandler,
  findOneProductUseCaseHandler,
  logEvents,
  errorHandlers,
});
const rateProductControllerHandler = rateProductController({
  dbProductHandler,
  rateProductUseCaseHandler,
  makeHttpError,
  logEvents,
  errorHandlers,
});
// const findProductRatingControllerHandler = findProductRatingController({ dbProductHandler, findProductRatingUseCaseHandler, errorHandlers });
// const findBestUserRaterControllerHandler = findBestUserRaterController({ dbProductHandler, findBestUserRaterUseCaseHandler, errorHandlers });

module.exports = {
  createProductControllerHandler,
  findAllProductControllerHandler,
  findOneProductControllerHandler,
  updateProductControllerHandler,
  deleteProductControllerHandler,
  rateProductControllerHandler,
};
