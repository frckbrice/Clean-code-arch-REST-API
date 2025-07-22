const router = require('express').Router();
const requestResponseAdapter = require('../interface-adapters/adapter/request-response-adapter');
const productControllerHamdlers = require('../interface-adapters/controllers/products');

const {
  createProductControllerHandler,
  findAllProductControllerHandler,
  findOneProductControllerHandler,
  updateProductControllerHandler,
  deleteProductControllerHandler,
  rateProductControllerHandler,
} = productControllerHamdlers;

// GET /products - Get all products
router
  .route('/')
  .post(async (req, res) =>
    requestResponseAdapter(createProductControllerHandler)(req, res)
)
  .get(async (req, res) =>
    requestResponseAdapter(findAllProductControllerHandler)(req, res)
  );

// GET /products/:productId - Get one product
router
  .route('/:productId')
  .get(async (req, res) =>
    requestResponseAdapter(findOneProductControllerHandler)(req, res)
  )
  .put(async (req, res) =>
    requestResponseAdapter(updateProductControllerHandler)(req, res)
  )
  .delete(async (req, res) =>
    requestResponseAdapter(deleteProductControllerHandler)(req, res)
  );

// POST /products/:productId/:userId/rating - Rate product
router
  .route('/:productId/:userId/rating')
  .post(async (req, res) =>
    requestResponseAdapter(rateProductControllerHandler)(req, res)
  );

module.exports = router;
