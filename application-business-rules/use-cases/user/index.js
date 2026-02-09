const authUseCases = require('./user-auth-usecases');
const profileUseCases = require('./user-profile-usecases');
const { dbUserHandler } = require('../../../interface-adapters/database-access');
const { makeUser, validateId } = require('../../../enterprise-business-rules/entities');
const { RequiredParameterError } = require('../../../interface-adapters/validators-errors/errors');
const { logEvents, log } = require('../../../interface-adapters/middlewares/loggers/logger');
const { makeHttpError } = require('../../../interface-adapters/validators-errors/http-error');

const entityModels = require('../../../enterprise-business-rules/entities');

// Auth Use Cases
const registerUserUseCaseHandler = authUseCases.registerUserUseCase({
  dbUserHandler,
  entityModels,
  logEvents,
  log,
  makeHttpError,
});
const loginUserUseCaseHandler = authUseCases.loginUserUseCase({
  dbUserHandler,
  logEvents,
  log,
  makeHttpError,
});
const logoutUseCaseHandler = authUseCases.logoutUseCase({ RequiredParameterError, logEvents, log });
const refreshTokenUseCaseHandler = authUseCases.refreshTokenUseCase({
  dbUserHandler,
  RequiredParameterError,
  logEvents,
  log,
});
const forgotPasswordUseCaseHandler = authUseCases.forgotPasswordUseCase({
  dbUserHandler,
  logEvents,
  log,
});
const resetPasswordUseCaseHandler = authUseCases.resetPasswordUseCase({
  dbUserHandler,
  logEvents,
  log,
  makeHttpError,
});

const findAllUsersUseCaseHandler = profileUseCases.findAllUsersUseCase({
  dbUserHandler,
  logEvents,
});
const findOneUserUseCaseHandler = profileUseCases.findOneUserUseCase({
  dbUserHandler,
  validateId,
  logEvents,
  log,
});
const updateUserUseCaseHandler = profileUseCases.updateUserUseCase({
  dbUserHandler,
  makeUser,
  validateId,
  RequiredParameterError,
  logEvents,
  log,
  makeHttpError,
});
const deleteUserUseCaseHandler = profileUseCases.deleteUserUseCase({
  dbUserHandler,
  validateId,
  RequiredParameterError,
  logEvents,
  log,
});
const blockUserUseCaseHandler = profileUseCases.blockUserUseCase({
  dbUserHandler,
  validateId,
  RequiredParameterError,
  logEvents,
  log,
});
const unBlockUserUseCaseHandler = profileUseCases.unBlockUserUseCase({
  dbUserHandler,
  validateId,
  RequiredParameterError,
  logEvents,
  log,
});

module.exports = {
  // Auth
  registerUserUseCaseHandler,
  loginUserUseCaseHandler,
  logoutUseCaseHandler,
  refreshTokenUseCaseHandler,
  forgotPasswordUseCaseHandler,
  resetPasswordUseCaseHandler,
  // Profile
  findAllUsersUseCaseHandler,
  findOneUserUseCaseHandler,
  updateUserUseCaseHandler,
  deleteUserUseCaseHandler,
  blockUserUseCaseHandler,
  unBlockUserUseCaseHandler,
};
