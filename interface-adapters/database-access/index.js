const { dbconnection } = require('./db-connection');
const { logEvents } = require('../middlewares/loggers/logger');
const makeUserdb = require('./store-user');
const makeBlogDb = require('./store-blog');

const dbProductHandler = require('./store-product')({ dbconnection, logEvents });
const dbUserHandler = makeUserdb({ dbconnection });
const dbBlogHandler = makeBlogDb({ dbconnection });

module.exports = {
  dbUserHandler,
  dbProductHandler,
  dbBlogHandler,
};
