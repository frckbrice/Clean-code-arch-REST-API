// Blog controller factories (Clean Architecture)
const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-content-type-options': 'nosniff',
};

const createBlogController = ({ createBlogUseCaseHandler, errorHandlers, logEvents }) =>
  async function createBlogControllerHandler(httpRequest) {
    const { body } = httpRequest;
    if (!body || Object.keys(body).length === 0) {
      return {
        headers: defaultHeaders,
        statusCode: 400,
        errorMessage: 'No blog data provided',
      };
    }
    try {
      const createdBlog = await createBlogUseCaseHandler(body);
      return {
        headers: defaultHeaders,
        statusCode: 201,
        data: { createdBlog },
      };
    } catch (e) {
      logEvents && logEvents(e.message, 'blogController.log');
      return {
        headers: defaultHeaders,
        statusCode: 500,
        errorMessage: e.message,
      };
    }
  };

const findAllBlogsController = ({ findAllBlogsUseCaseHandler, logEvents }) =>
  async function findAllBlogsControllerHandler(httpRequest) {
    try {
      const blogs = await findAllBlogsUseCaseHandler();
      return {
        headers: defaultHeaders,
        statusCode: 200,
        data: { blogs },
      };
    } catch (e) {
      logEvents && logEvents(e.message, 'blogController.log');
      return {
        headers: defaultHeaders,
        statusCode: 500,
        errorMessage: e.message,
      };
    }
  };

const findOneBlogController = ({ findOneBlogUseCaseHandler, logEvents }) =>
  async function findOneBlogControllerHandler(httpRequest) {
    const { blogId } = httpRequest.params;
    if (!blogId) {
      return {
        headers: defaultHeaders,
        statusCode: 400,
        errorMessage: 'No blog Id provided',
      };
    }
    try {
      const blog = await findOneBlogUseCaseHandler({ blogId });
      return {
        headers: defaultHeaders,
        statusCode: 200,
        data: { blog },
      };
    } catch (e) {
      logEvents && logEvents(e.message, 'blogController.log');
      return {
        headers: defaultHeaders,
        statusCode: 500,
        errorMessage: e.message,
      };
    }
  };

const updateBlogController = ({ updateBlogUseCaseHandler, logEvents }) =>
  async function updateBlogControllerHandler(httpRequest) {
    const { blogId } = httpRequest.params;
    const updateData = httpRequest.body;
    if (!blogId || !updateData) {
      return {
        headers: defaultHeaders,
        statusCode: 400,
        errorMessage: 'No blog Id or update data provided',
      };
    }
    try {
      const updatedBlog = await updateBlogUseCaseHandler({ blogId, updateData });
      return {
        headers: defaultHeaders,
        statusCode: 200,
        data: { updatedBlog },
      };
    } catch (e) {
      logEvents && logEvents(e.message, 'blogController.log');
      return {
        headers: defaultHeaders,
        statusCode: 500,
        errorMessage: e.message,
      };
    }
  };

const deleteBlogController = ({ deleteBlogUseCaseHandler, logEvents }) =>
  async function deleteBlogControllerHandler(httpRequest) {
    const { blogId } = httpRequest.params;
    if (!blogId) {
      return {
        headers: defaultHeaders,
        statusCode: 400,
        errorMessage: 'No blog Id provided',
      };
    }
    try {
      const deleted = await deleteBlogUseCaseHandler({ blogId });
      return {
        headers: defaultHeaders,
        statusCode: 200,
        data: deleted,
      };
    } catch (e) {
      logEvents && logEvents(e.message, 'blogController.log');
      return {
        headers: defaultHeaders,
        statusCode: 500,
        errorMessage: e.message,
      };
    }
  };

module.exports = {
  createBlogController,
  findAllBlogsController,
  findOneBlogController,
  updateBlogController,
  deleteBlogController,
};
