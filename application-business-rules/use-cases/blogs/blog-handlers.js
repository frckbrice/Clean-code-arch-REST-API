// Blog use cases (Clean Architecture)
module.exports = {
  createBlogUseCase: ({ dbBlogHandler, makeBlogModel, logEvents, errorHandlers }) =>
    async function createBlogUseCaseHandler(blogData) {
      try {
        const validatedBlog = await makeBlogModel({ blogData });
        const newBlog = await dbBlogHandler.createBlog(validatedBlog);
        return Object.freeze(newBlog);
      } catch (error) {
        logEvents && logEvents(error.message, 'blogUseCase.log');
        throw error;
      }
    },

  findAllBlogsUseCase: ({ dbBlogHandler, logEvents }) =>
    async function findAllBlogsUseCaseHandler() {
      try {
        const blogs = await dbBlogHandler.findAllBlogs();
        return blogs || [];
      } catch (error) {
        logEvents && logEvents(error.message, 'blogUseCase.log');
        throw error;
      }
    },

  findOneBlogUseCase: ({ dbBlogHandler, logEvents }) =>
    async function findOneBlogUseCaseHandler({ blogId }) {
      try {
        const blog = await dbBlogHandler.findOneBlog({ blogId });
        if (!blog) throw new Error('Blog not found');
        return blog;
      } catch (error) {
        logEvents && logEvents(error.message, 'blogUseCase.log');
        throw error;
      }
    },

  updateBlogUseCase: ({ dbBlogHandler, makeBlogModel, logEvents, errorHandlers }) =>
    async function updateBlogUseCaseHandler({ blogId, updateData }) {
      try {
        const existingBlog = await dbBlogHandler.findOneBlog({ blogId });
        if (!existingBlog) throw new Error('Blog not found');
        const validatedBlog = await makeBlogModel({ blogData: { ...existingBlog, ...updateData } });
        const updatedBlog = await dbBlogHandler.updateBlog({ blogId, ...validatedBlog });
        return Object.freeze(updatedBlog);
      } catch (error) {
        logEvents && logEvents(error.message, 'blogUseCase.log');
        throw error;
      }
    },

  deleteBlogUseCase: ({ dbBlogHandler, logEvents }) =>
    async function deleteBlogUseCaseHandler({ blogId }) {
      try {
        const deleted = await dbBlogHandler.deleteBlog({ blogId });
        return deleted;
      } catch (error) {
        logEvents && logEvents(error.message, 'blogUseCase.log');
        throw error;
      }
    },
};
