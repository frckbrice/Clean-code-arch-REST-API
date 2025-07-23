const blogUseCases = require('./blog-handlers');
const { dbBlogHandler } = require('../../../interface-adapters/database-access');
const { makeBlogModel } = require('../../../enterprise-business-rules/entities/blog-model');
const { logEvents } = require('../../../interface-adapters/middlewares/loggers/logger');
const errorHandlers = require('../../../interface-adapters/validators-errors/errors');

module.exports = {
  createBlogUseCaseHandler: blogUseCases.createBlogUseCase({
    dbBlogHandler,
    makeBlogModel,
    logEvents,
    errorHandlers,
  }),
  findAllBlogsUseCaseHandler: blogUseCases.findAllBlogsUseCase({ dbBlogHandler, logEvents }),
  findOneBlogUseCaseHandler: blogUseCases.findOneBlogUseCase({ dbBlogHandler, logEvents }),
  updateBlogUseCaseHandler: blogUseCases.updateBlogUseCase({
    dbBlogHandler,
    makeBlogModel,
    logEvents,
    errorHandlers,
  }),
  deleteBlogUseCaseHandler: blogUseCases.deleteBlogUseCase({ dbBlogHandler, logEvents }),
};
