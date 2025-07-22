const { dbProductHandler } = require('../../database-access');
const productControllerHandlsers = require('./product-controller')();
const productUseCaseHandlers = require('../../../application-business-rules/use-cases/products');

module.exports = {
  ...productControllerHandlsers,
  ...productUseCaseHandlers,
};
