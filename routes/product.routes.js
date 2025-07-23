const router = require('express').Router();
const requestResponseAdapter = require('../interface-adapters/adapter/request-response-adapter');
const productControllerHamdlers = require('../interface-adapters/controllers/products');
const { authVerifyJwt, isAdmin } = require('../interface-adapters/middlewares/auth-verifyJwt');

const {
  createProductControllerHandler,
  findAllProductControllerHandler,
  findOneProductControllerHandler,
  updateProductControllerHandler,
  deleteProductControllerHandler,
  rateProductControllerHandler,
} = productControllerHamdlers;

// POST /products - Create product (protected: authenticated users)
// GET /products - Get all products (public)
router
  .route('/')
  .post(authVerifyJwt, async (req, res) => requestResponseAdapter(createProductControllerHandler)(req, res))
  .get(async (req, res) => requestResponseAdapter(findAllProductControllerHandler)(req, res));

// GET /products/:productId - Get one product (public)
// PUT /products/:productId - Update product (protected: authenticated users)
// DELETE /products/:productId - Delete product (protected: admin only)
router
  .route('/:productId')
  .get(async (req, res) => requestResponseAdapter(findOneProductControllerHandler)(req, res))
  .put(authVerifyJwt, async (req, res) => requestResponseAdapter(updateProductControllerHandler)(req, res))
  .delete(authVerifyJwt, isAdmin, async (req, res) => requestResponseAdapter(deleteProductControllerHandler)(req, res));

// POST /products/:productId/:userId/rating - Rate product (protected: authenticated users)
router
  .route('/:productId/:userId/rating')
  .post(authVerifyJwt, async (req, res) => requestResponseAdapter(rateProductControllerHandler)(req, res));

// in this case: it is a desgin decision to let the route be public and limited to authenticated users
//  You can further restrict creation and update to admins only by adding isAdmin middleware.
// .post(authVerifyJwt, isAdmin, ...) and .put(authVerifyJwt, isAdmin, ...)

module.exports = router;
