const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const { logEvents } = require('./loggers/logger');

const authVerifyJwt = expressAsyncHandler((req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Need to login first.' });
  }

  //get the token from the header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Need to login first.' });
  }

  try {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRETKEY,
      { algorithms: ['HS256'] },
      (err, decodedUserInfo) => {
        if (err) {
          return res.status(403).json({ error: 'ACCESS_FORBIDDEN. TOKEN_EXPIRED' });
        }

        if (!decodedUserInfo) {
          return res.status(401).json({ error: 'Unauthorized. Need to login first.' });
        }
        const userInfo = {};
        userInfo.email = decodedUserInfo.email;
        userInfo.id = decodedUserInfo.id;
        userInfo.roles = decodedUserInfo.roles;
        userInfo.isBlocked = decodedUserInfo.isBlocked;
        req.user = userInfo;

        next();
      }
    );
  } catch (error) {
    console.error('catch error on authVerifyJwt', error);
    logEvents(`${error.no}:${error.code}\t${error.name}\t${error.message}`, 'authVerifyJwt.log');
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Middleware function to check if the user is an admin.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} If the user is an admin, calls the next middleware function. Otherwise, sends a 403 status code with an error message.
 */
const isAdmin = (req, res, next) => {
  if (req.user && Array.isArray(req.user.roles) && req.user.roles.includes('admin')) {
    next();
  } else {
    return res.status(403).json({ error: 'ACCESS_DENIED. NOT AN ADMIN' });
  }
};

/**
 * Middleware function to check if the user is blocked.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} If the user is blocked, redirects to the blocked page. Otherwise, calls the next middleware function.
 */
const isBlocked = (req, res, next) => {
  const { isBlocked } = req.user;
  if (isBlocked) return res.status(403).send('ACCESS_DENIED. USER_BLOCKED');
  next();
};

module.exports = { authVerifyJwt, isAdmin, isBlocked };
