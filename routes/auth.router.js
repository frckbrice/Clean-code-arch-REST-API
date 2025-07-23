/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Invalid input
 */
const router = require('express').Router();
const makeResponseCallback = require('../interface-adapters/adapter/request-response-adapter');
const userControllerHandlers = require('../interface-adapters/controllers/users');
const { authVerifyJwt } = require('../interface-adapters/middlewares/auth-verifyJwt');
const loginLimiter = require('../interface-adapters/middlewares/loginLimiter');

const {
  registerUserControllerHandler,
  loginUserControllerHandler,
  logoutUserControllerHandler,
  refreshTokenUserControllerHandler,
  forgotPasswordControllerHandler,
  resetPasswordControllerHandler,
} = userControllerHandlers;

// Registration and login are public
router.post('/register', async (req, res) =>
  makeResponseCallback(registerUserControllerHandler)(req, res)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', loginLimiter, async (req, res) =>
  makeResponseCallback(loginUserControllerHandler)(req, res)
);

// Logout and refresh token (protected: authenticated users)
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authVerifyJwt, async (req, res) =>
  makeResponseCallback(logoutUserControllerHandler)(req, res)
);
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh-token', authVerifyJwt, async (req, res) =>
  makeResponseCallback(refreshTokenUserControllerHandler)(req, res)
);

// Forgot/reset password (public)
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid input
 */
router.post('/forgot-password', async (req, res) =>
  makeResponseCallback(forgotPasswordControllerHandler)(req, res)
);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid input
 */
router.post('/reset-password', async (req, res) =>
  makeResponseCallback(resetPasswordControllerHandler)(req, res)
);

module.exports = router;
