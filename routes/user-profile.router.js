const router = require('express').Router();
const makeResponseCallback = require('../interface-adapters/adapter/request-response-adapter');
const userControllerHandlers = require('../interface-adapters/controllers/users');
const { authVerifyJwt, isAdmin } = require('../interface-adapters/middlewares/auth-verifyJwt');

const {
  findAllUsersControllerHandler,
  findOneUserControllerHandler,
  updateUserControllerHandler,
  deleteUserControllerHandler,
  blockUserControllerHandler,
  unBlockUserControllerHandler,
} = userControllerHandlers;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and admin management
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         isBlocked:
 *           type: boolean
 *       required:
 *         - username
 *         - email
 *         - role
 *     UserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - username
 *         - email
 *         - password
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authVerifyJwt, async (req, res) =>
  makeResponseCallback(updateUserControllerHandler)(req, res)
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authVerifyJwt, isAdmin, async (req, res) =>
  makeResponseCallback(findAllUsersControllerHandler)(req, res)
);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get('/:userId', authVerifyJwt, async (req, res) =>
  makeResponseCallback(findOneUserControllerHandler)(req, res)
);
router.delete('/:userId', authVerifyJwt, isAdmin, async (req, res) =>
  makeResponseCallback(deleteUserControllerHandler)(req, res)
);

/**
 * @swagger
 * /users/block-user/{userId}:
 *   post:
 *     summary: Block a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.post('/block-user/:userId', authVerifyJwt, isAdmin, async (req, res) =>
  makeResponseCallback(blockUserControllerHandler)(req, res)
);

/**
 * @swagger
 * /users/unblock-user/{userId}:
 *   post:
 *     summary: Unblock a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unblocked
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.post('/unblock-user/:userId', authVerifyJwt, isAdmin, async (req, res) =>
  makeResponseCallback(unBlockUserControllerHandler)(req, res)
);

// Best practice: You can further restrict profile update to only the user themselves or admins by adding a custom middleware.

module.exports = router;
