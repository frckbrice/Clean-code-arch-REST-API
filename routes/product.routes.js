const router = require('express').Router();
const requestResponseAdapter = require('../interface-adapters/adapter/request-response-adapter');
const productControllerHamdlers = require('../interface-adapters/controllers/products');

// POST /products - Create product
router
  .route('/')
  .post(async (req, res) =>
    requestResponseAdapter(productControllerHamdlers.createProductControllerHandler)(req, res)
  )
  // GET /products - Get all products
  .get(async (req, res) =>
    requestResponseAdapter(productControllerHamdlers.findAllProductControllerHandler)(req, res)
  );

// GET /products/:productId - Get one product
// PUT /products/:productId - Update product
// DELETE /products/:productId - Delete product
router
  .route('/:productId')
  .get(async (req, res) =>
    requestResponseAdapter(productControllerHamdlers.findOneProductControllerHandler)(req, res)
  )
  .put(async (req, res) =>
    requestResponseAdapter(productControllerHamdlers.updateProductControllerHandler)(req, res)
  )
  .delete(async (req, res) =>
    requestResponseAdapter(productControllerHamdlers.deleteProductControllerHandler)(req, res)
  );

// POST /products/:productId/:userId/rating - Rate product
router
  .route('/:productId/:userId/rating')
  .post(async (req, res) =>
    requestResponseAdapter(productControllerHamdlers.rateProductControllerHandler)(req, res)
  );

module.exports = router;
