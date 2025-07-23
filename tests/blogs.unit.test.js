/* eslint-env jest */
const {
  createBlogController,
  findAllBlogsController,
  findOneBlogController,
  updateBlogController,
  deleteBlogController,
} = require('../interface-adapters/controllers/blogs/blog-controller');

describe('Blog Controller Unit Tests', () => {
  it('should create a blog (mocked)', async () => {
    const createBlogUseCaseHandler = jest
      .fn()
      .mockResolvedValue({ id: 'blog1', title: 'Test Blog', content: 'Lorem ipsum', author: 'u1' });
    const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
    const logEvents = jest.fn();
    const handler = createBlogController({ createBlogUseCaseHandler, errorHandlers, logEvents });
    const httpRequest = { body: { title: 'Test Blog', content: 'Lorem ipsum', author: 'u1' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data.createdBlog).toEqual({
      id: 'blog1',
      title: 'Test Blog',
      content: 'Lorem ipsum',
      author: 'u1',
    });
  });

  it('should return 400 if no blog data provided', async () => {
    const createBlogUseCaseHandler = jest.fn();
    const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
    const logEvents = jest.fn();
    const handler = createBlogController({ createBlogUseCaseHandler, errorHandlers, logEvents });
    const httpRequest = { body: {} };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.errorMessage).toBe('No blog data provided');
  });

  it('should get all blogs (mocked)', async () => {
    const findAllBlogsUseCaseHandler = jest.fn().mockResolvedValue([{ id: 'b1' }, { id: 'b2' }]);
    const logEvents = jest.fn();
    const handler = findAllBlogsController({ findAllBlogsUseCaseHandler, logEvents });
    const httpRequest = { query: {} };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.data.blogs)).toBe(true);
  });

  it('should get a blog by id (mocked)', async () => {
    const findOneBlogUseCaseHandler = jest.fn().mockResolvedValue({ id: 'b1', title: 'Test Blog' });
    const logEvents = jest.fn();
    const handler = findOneBlogController({ findOneBlogUseCaseHandler, logEvents });
    const httpRequest = { params: { blogId: 'b1' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(response.data.blog).toEqual({ id: 'b1', title: 'Test Blog' });
  });

  it('should update a blog (mocked)', async () => {
    const updateBlogUseCaseHandler = jest.fn().mockResolvedValue({ id: 'b1', title: 'Updated' });
    const logEvents = jest.fn();
    const handler = updateBlogController({ updateBlogUseCaseHandler, logEvents });
    const httpRequest = { params: { blogId: 'b1' }, body: { title: 'Updated' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(response.data.updatedBlog).toEqual({ id: 'b1', title: 'Updated' });
  });

  it('should delete a blog (mocked)', async () => {
    const deleteBlogUseCaseHandler = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const logEvents = jest.fn();
    const handler = deleteBlogController({ deleteBlogUseCaseHandler, logEvents });
    const httpRequest = { params: { blogId: 'b1' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(response.data.deletedCount).toBe(1);
  });

  it('should handle DB error on create', async () => {
    const createBlogUseCaseHandler = jest.fn().mockRejectedValue(new Error('DB error'));
    const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
    const logEvents = jest.fn();
    const handler = createBlogController({ createBlogUseCaseHandler, errorHandlers, logEvents });
    const httpRequest = { body: { title: 'Test Blog' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe('DB error');
  });
});
