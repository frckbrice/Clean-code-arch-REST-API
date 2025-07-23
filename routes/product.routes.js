/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The product ID
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         createdBy:
 *           type: string
 *       required:
 *         - name
 *         - price
 *         - description
 *         - category
 *         - createdBy
 *     ProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         createdBy:
 *           type: string
 *       required:
 *         - name
 *         - price
 *         - description
 *         - category
 *         - createdBy
 */

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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router
  .route('/')
  .post(authVerifyJwt, async (req, res) =>
    requestResponseAdapter(createProductControllerHandler)(req, res)
  )
  .get(async (req, res) => requestResponseAdapter(findAllProductControllerHandler)(req, res));

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router
  .route('/:productId')
  .get(async (req, res) => requestResponseAdapter(findOneProductControllerHandler)(req, res))
  .put(authVerifyJwt, async (req, res) =>
    requestResponseAdapter(updateProductControllerHandler)(req, res)
  )
  .delete(authVerifyJwt, isAdmin, async (req, res) =>
    requestResponseAdapter(deleteProductControllerHandler)(req, res)
  );

/**
 * @swagger
 * /products/{productId}/{userId}/rating:
 *   post:
 *     summary: Rate a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratingValue:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product rated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:productId/:userId/rating')
  .post(authVerifyJwt, async (req, res) =>
    requestResponseAdapter(rateProductControllerHandler)(req, res)
  );

// in this case: it is a desgin decision to let the route be public and limited to authenticated users
//  You can further restrict creation and update to admins only by adding isAdmin middleware.
// .post(authVerifyJwt, isAdmin, ...) and .put(authVerifyJwt, isAdmin, ...)

module.exports = router;
