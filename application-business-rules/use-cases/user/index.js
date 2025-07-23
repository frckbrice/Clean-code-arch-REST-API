const authUseCases = require('./user-auth-usecases');
const profileUseCases = require('./user-profile-usecases');
const { dbUserHandler } = require('../../../interface-adapters/database-access');
const { makeUser, validateId } = require('../../../enterprise-business-rules/entities');
const { RequiredParameterError } = require('../../../interface-adapters/validators-errors/errors');
const { logEvents } = require('../../../interface-adapters/middlewares/loggers/logger');
const { makeHttpError } = require('../../../interface-adapters/validators-errors/http-error');

const entityModels = require('../../../enterprise-business-rules/entities');

// Auth Use Cases
const registerUserUseCaseHandler = authUseCases.registerUserUseCase({ dbUserHandler, entityModels, logEvents, makeHttpError });
const loginUserUseCaseHandler = authUseCases.loginUserUseCase({ dbUserHandler, logEvents, makeHttpError });
const logoutUseCaseHandler = authUseCases.logoutUseCase({ RequiredParameterError, logEvents });
const refreshTokenUseCaseHandler = authUseCases.refreshTokenUseCase({ dbUserHandler, RequiredParameterError, logEvents });
const forgotPasswordUseCaseHandler = authUseCases.forgotPasswordUseCase({ dbUserHandler, logEvents });
const resetPasswordUseCaseHandler = authUseCases.resetPasswordUseCase({ dbUserHandler, logEvents, makeHttpError });

// Profile Use Cases
const findAllUsersUseCaseHandler = profileUseCases.findAllUsersUseCase({ dbUserHandler, logEvents });
const findOneUserUseCaseHandler = profileUseCases.findOneUserUseCase({ dbUserHandler, validateId, logEvents });
const updateUserUseCaseHandler = profileUseCases.updateUserUseCase({ dbUserHandler, makeUser, validateId, RequiredParameterError, logEvents, makeHttpError });
const deleteUserUseCaseHandler = profileUseCases.deleteUserUseCase({ dbUserHandler, validateId, RequiredParameterError, logEvents });
const blockUserUseCaseHandler = profileUseCases.blockUserUseCase({ dbUserHandler, validateId, RequiredParameterError, logEvents });
const unBlockUserUseCaseHandler = profileUseCases.unBlockUserUseCase({ dbUserHandler, validateId, RequiredParameterError, logEvents });

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
