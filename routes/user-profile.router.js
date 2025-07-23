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

// Profile update (protected: authenticated users)
router.put('/profile', authVerifyJwt, async (req, res) => makeResponseCallback(updateUserControllerHandler)(req, res));

// Get all users (protected: admin only)
router.get('/', authVerifyJwt, isAdmin, async (req, res) => makeResponseCallback(findAllUsersControllerHandler)(req, res));

// Get one user (protected: authenticated users)
router.get('/:userId', authVerifyJwt, async (req, res) => makeResponseCallback(findOneUserControllerHandler)(req, res));

// Delete user (protected: admin only)
router.delete('/:userId', authVerifyJwt, isAdmin, async (req, res) => makeResponseCallback(deleteUserControllerHandler)(req, res));

// Block/unblock user (protected: admin only)
router.post('/block-user/:userId', authVerifyJwt, isAdmin, async (req, res) => makeResponseCallback(blockUserControllerHandler)(req, res));
router.post('/unblock-user/:userId', authVerifyJwt, isAdmin, async (req, res) => makeResponseCallback(unBlockUserControllerHandler)(req, res));

// Best practice: You can further restrict profile update to only the user themselves or admins by adding a custom middleware.

module.exports = router; 