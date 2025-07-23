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
router.post('/login', loginLimiter, async (req, res) =>
  makeResponseCallback(loginUserControllerHandler)(req, res)
);

// Logout and refresh token (protected: authenticated users)
router.post('/logout', authVerifyJwt, async (req, res) =>
  makeResponseCallback(logoutUserControllerHandler)(req, res)
);
router.post('/refresh-token', authVerifyJwt, async (req, res) =>
  makeResponseCallback(refreshTokenUserControllerHandler)(req, res)
);

// Forgot/reset password (public)
router.post('/forgot-password', async (req, res) =>
  makeResponseCallback(forgotPasswordControllerHandler)(req, res)
);
router.post('/reset-password', async (req, res) =>
  makeResponseCallback(resetPasswordControllerHandler)(req, res)
);

module.exports = router;
