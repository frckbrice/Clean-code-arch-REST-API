const userAuthControllers = require('./user-auth-controller');
const userProfileControllers = require('./user-profile-controller');
const userUseCaseHandlers = require('../../../application-business-rules/use-cases/user');

const { makeHttpError } = require('../../validators-errors/http-error');
const { logEvents } = require('../../middlewares/loggers/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../adapter/email-sending');
const { UniqueConstraintError, InvalidPropertyError } = require('../../validators-errors/errors');

// Auth Controllers
const registerUserControllerHandler = userAuthControllers.registerUserController({
  registerUserUseCaseHandler: userUseCaseHandlers.registerUserUseCaseHandler,
  UniqueConstraintError,
  InvalidPropertyError,
  makeHttpError,
  logEvents,
});
const loginUserControllerHandler = userAuthControllers.loginUserController({
  loginUserUseCaseHandler: userUseCaseHandlers.loginUserUseCaseHandler,
  UniqueConstraintError,
  InvalidPropertyError,
  makeHttpError,
  logEvents,
  bcrypt,
  jwt,
});
const logoutUserControllerHandler = userAuthControllers.logoutUserController({
  logoutUseCaseHandler: userUseCaseHandlers.logoutUseCaseHandler,
  UniqueConstraintError,
  InvalidPropertyError,
  makeHttpError,
  logEvents,
});
const refreshTokenUserControllerHandler = userAuthControllers.refreshTokenUserController({
  refreshTokenUseCaseHandler: userUseCaseHandlers.refreshTokenUseCaseHandler,
  makeHttpError,
  logEvents,
  jwt,
});
const forgotPasswordControllerHandler = userAuthControllers.forgotPasswordController({
  forgotPasswordUseCaseHandler: userUseCaseHandlers.forgotPasswordUseCaseHandler,
  UniqueConstraintError,
  sendEmail,
  InvalidPropertyError,
  makeHttpError,
  logEvents,
});
const resetPasswordControllerHandler = userAuthControllers.resetPasswordController({
  resetPasswordUseCaseHandler: userUseCaseHandlers.resetPasswordUseCaseHandler,
  UniqueConstraintError,
  InvalidPropertyError,
  makeHttpError,
  logEvents,
});

// Profile Controllers
const findAllUsersControllerHandler = userProfileControllers.findAllUsersController({
  findAllUsersUseCaseHandler: userUseCaseHandlers.findAllUsersUseCaseHandler,
  makeHttpError,
  logEvents,
});
const findOneUserControllerHandler = userProfileControllers.findOneUserController({
  findOneUserUseCaseHandler: userUseCaseHandlers.findOneUserUseCaseHandler,
  makeHttpError,
  logEvents,
});
const updateUserControllerHandler = userProfileControllers.updateUserController({
  updateUserUseCaseHandler: userUseCaseHandlers.updateUserUseCaseHandler,
  makeHttpError,
  logEvents,
});
const deleteUserControllerHandler = userProfileControllers.deleteUserController({
  deleteUserUseCaseHandler: userUseCaseHandlers.deleteUserUseCaseHandler,
  makeHttpError,
  logEvents,
});
const blockUserControllerHandler = userProfileControllers.blockUserController({
  blockUserUseCaseHandler: userUseCaseHandlers.blockUserUseCaseHandler,
  makeHttpError,
  logEvents,
});
const unBlockUserControllerHandler = userProfileControllers.unBlockUserController({
  unBlockUserUseCaseHandler: userUseCaseHandlers.unBlockUserUseCaseHandler,
  makeHttpError,
  logEvents,
});

module.exports = {
  // Auth
  registerUserControllerHandler,
  loginUserControllerHandler,
  logoutUserControllerHandler,
  refreshTokenUserControllerHandler,
  forgotPasswordControllerHandler,
  resetPasswordControllerHandler,
  // Profile
  findAllUsersControllerHandler,
  findOneUserControllerHandler,
  updateUserControllerHandler,
  deleteUserControllerHandler,
  blockUserControllerHandler,
  unBlockUserControllerHandler,
};
