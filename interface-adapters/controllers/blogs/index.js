const blogController = require('./blog-controller');
const blogUseCaseHandlers = require('../../../application-business-rules/use-cases/blogs');
const { logEvents } = require('../../middlewares/loggers/logger');
const errorHandlers = require('../../validators-errors/errors');

module.exports = {
  createBlogControllerHandler: blogController.createBlogController({
    createBlogUseCaseHandler: blogUseCaseHandlers.createBlogUseCaseHandler,
    errorHandlers,
    logEvents,
  }),
  findAllBlogsControllerHandler: blogController.findAllBlogsController({
    findAllBlogsUseCaseHandler: blogUseCaseHandlers.findAllBlogsUseCaseHandler,
    logEvents,
  }),
  findOneBlogControllerHandler: blogController.findOneBlogController({
    findOneBlogUseCaseHandler: blogUseCaseHandlers.findOneBlogUseCaseHandler,
    logEvents,
  }),
  updateBlogControllerHandler: blogController.updateBlogController({
    updateBlogUseCaseHandler: blogUseCaseHandlers.updateBlogUseCaseHandler,
    logEvents,
  }),
  deleteBlogControllerHandler: blogController.deleteBlogController({
    deleteBlogUseCaseHandler: blogUseCaseHandlers.deleteBlogUseCaseHandler,
    logEvents,
  }),
};
