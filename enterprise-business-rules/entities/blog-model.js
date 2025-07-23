const blogValidation = require('../validate-models/blog-validation');

module.exports = {
  makeBlogModel: ({ blogValidation, logEvents }) => {
    return async function makeBlog({ blogData }) {
      try {
        const validatedBlog = await blogValidation.blogPostValidation({
          blogPostData: blogData,
          errorHandlers: blogValidation,
        });
        // Add normalization or additional logic if needed
        return Object.freeze(validatedBlog);
      } catch (error) {
        logEvents && logEvents(`${error.message}`, 'blog-model.log');
        throw error;
      }
    };
  },
};
