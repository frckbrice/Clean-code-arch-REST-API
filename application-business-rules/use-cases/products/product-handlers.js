'use strict';

const productValidationFcts = require('../../../enterprise-business-rules/validate-models/product-validation-fcts');
const { log } = require('../../../interface-adapters/middlewares/loggers/logger');

/**
 * Creates a new product in the database using the provided product data.
 *
 * @param {Object} options - An object containing the following properties:
 *   - makeProductModelHandler: A function that validates the product data and returns normalized data.
 *   - createProductHandler: An object containing the createProduct function to store the product in the database.
 *   - productData: The data of the product to be created.
 *   - errorHandlers: An object containing error handlers for validation errors.
 * @return {Promise<Object>} A promise that resolves to the newly created product, frozen to prevent mutation.
 * @throws {Error} If there is an error during the creation process, an error with the error message is thrown.
 */
const createProductUseCase = ({ makeProductModelHandler }) =>
  async function createProductUseCaseHandler({
    createProductDbHandler,
    productData,
    errorHandlers,
  }) {
    try {
      const validatedProductData = await makeProductModelHandler({ productData, errorHandlers });
      // store product in database mongodb
      const newProduct = await createProductDbHandler(validatedProductData);
      return Object.freeze(newProduct);
    } catch (error) {
      log.error('Error from create product handler:', error.message);
      throw new Error(error.message);
    }
  };

/**
 * Fetches a single product by ID.
 */
const findOneProductUseCase = ({ productValidation }) =>
  async function findOneProductUseCaseHandler({
    productId,
    findOneProductDbHandler,
    errorHandlers,
  }) {
    const { InvalidPropertyError } = errorHandlers;
    try {
      // validate id
      const uuid = productValidation.validateObjectId(productId, InvalidPropertyError);
      // store product in database mongodb
      const newProduct = await findOneProductDbHandler({ productId: uuid });
      return Object.freeze(newProduct);
    } catch (error) {
      log.error('Error from fetch one product handler:', error.message);
      throw new Error(error.message);
    }
  };

/**
 * Fetches all products with optional filters.
 */
const findAllProductsUseCase = () =>
  async function findAllProductUseCaseHandler({ dbProductHandler, filterOptions }) {
    try {
      const allProducts = await dbProductHandler.findAllProductsDbHandler(filterOptions);
      return Object.freeze(allProducts.data);
    } catch (e) {
      log.error('Error from fetch all product handler:', e.message);
      throw new Error(e.message);
    }
  };

/**
 * Deletes a product by ID.
 */
const deleteProductUseCase = () =>
  async function deleteProductUseCaseHandler({ productId, dbProductHandler, errorHandlers }) {
    const { findOneProductDbHandler, deleteProductDbHandler } = dbProductHandler;
    const { InvalidPropertyError } = errorHandlers;
    try {
      // validate id
      const uuid = productValidationFcts.validateObjectId(productId, InvalidPropertyError);
      // check first that the product exists
      const existingProduct = await findOneProductDbHandler({ productId: uuid });
      if (!existingProduct) {
        throw new Error('Product not exists! cannot delete it.');
      }
      // store product in database mongodb
      const newProduct = await deleteProductDbHandler({ productId: existingProduct.id });
      const result = {
        deletedCount: newProduct.id ? 1 : 0,
        message: newProduct.id ? 'product successfully deleted' : ' product not found',
      };
      return Object.freeze(result);
    } catch (error) {
      log.error('Error from delete product handler:', error.message);
      throw new Error(error.message);
    }
  };

/**
 * Updates a product by ID.
 */
const updateProductUseCase = ({ makeProductModelHandler }) =>
  async function updateProductUseCaseHandler({
    productId,
    updateData,
    dbProductHandler,
    errorHandlers,
  }) {
    const { findOneProductDbHandler, updateProductDbHandler } = dbProductHandler;
    const { InvalidPropertyError } = errorHandlers;
    try {
      // validate id
      const uuid = productValidationFcts.validateObjectId(productId, InvalidPropertyError);
      // check first that the product exists
      const existingProduct = await findOneProductDbHandler({ productId: uuid });
      if (!existingProduct) {
        throw new RangeError('Product not exists! cannot update it.');
      }

      // validate data before mutation
      const productData = await makeProductModelHandler({
        productData: { ...existingProduct, ...updateData },
        errorHandlers,
      });

      const newProduct = await updateProductDbHandler({ productId, ...productData });
      return Object.freeze(newProduct);
    } catch (error) {
      log.error('Error from update product handler:', error.message);
      throw new Error(error.message);
    }
  };

/**
 * Rates a product (creates rating and updates product aggregates in a transaction).
 */
const rateProductUseCase = ({ makeProductRatingModelHandler }) =>
  async function rateProductUseCaseHandler({
    userId,
    ratingValue,
    productId,
    dbProductHandler,
    errorHandlers,
  }) {
    const ratingData = { ratingValue, userId, productId };
    try {
      const ratingModel = await makeProductRatingModelHandler({ errorHandlers, ...ratingData });
      const newProduct = await dbProductHandler.rateProductDbHandler(ratingModel);
      return Object.freeze(newProduct);
    } catch (error) {
      log.error('Error from rating product handler:', error.message);
      throw new Error(error.message);
    }
  };

module.exports = Object.freeze({
  createProductUseCase,
  findOneProductUseCase,
  findAllProductsUseCase,
  deleteProductUseCase,
  updateProductUseCase,
  rateProductUseCase,
});
