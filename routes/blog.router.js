/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management and retrieval
 *
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The blog ID
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: string
 *       required:
 *         - title
 *         - content
 *         - author
 *     BlogInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: string
 *       required:
 *         - title
 *         - content
 *         - author
 */
const router = require('express').Router();
const requestResponseAdapter = require('../interface-adapters/adapter/request-response-adapter');
const blogControllerHandlers = require('../interface-adapters/controllers/blogs');
const { authVerifyJwt, isAdmin } = require('../interface-adapters/middlewares/auth-verifyJwt');

const {
  createBlogControllerHandler,
  findAllBlogsControllerHandler,
  findOneBlogControllerHandler,
  updateBlogControllerHandler,
  deleteBlogControllerHandler,
} = blogControllerHandlers;

// POST /blogs - Create blog (protected: authenticated users, optionally admins only)
// GET /blogs - Get all blogs (public)
router
  .route('/')
  .post(authVerifyJwt, async (req, res) =>
    requestResponseAdapter(createBlogControllerHandler)(req, res)
  )
  .get(async (req, res) => requestResponseAdapter(findAllBlogsControllerHandler)(req, res));

/**
 * @swagger
 * /blogs/{blogId}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogInput'
 *     responses:
 *       200:
 *         description: Blog updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog not found
 */
router
  .route('/:blogId')
  .get(async (req, res) => requestResponseAdapter(findOneBlogControllerHandler)(req, res))
  .put(authVerifyJwt, async (req, res) =>
    requestResponseAdapter(updateBlogControllerHandler)(req, res)
  )
  .delete(authVerifyJwt, isAdmin, async (req, res) =>
    requestResponseAdapter(deleteBlogControllerHandler)(req, res)
  );

// in this case: it is a desgin decision to let the route be public and limited to authenticated users
//  You can further restrict creation and update to admins only by adding isAdmin middleware.
// .post(authVerifyJwt, isAdmin, ...) and .put(authVerifyJwt, isAdmin, ...)

module.exports = router;
