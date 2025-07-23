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

// GET /blogs/:blogId - Get one blog (public)
// PUT /blogs/:blogId - Update blog (protected: authenticated users, optionally admins only)
// DELETE /blogs/:blogId - Delete blog (protected: admin only)
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
