/* eslint-env jest */
const {
  registerUserController,
  loginUserController,
  findOneUserController,
  updateUserController,
  deleteUserController,
  blockUserController,
  unBlockUserController,
} = require('../interface-adapters/controllers/users/user-auth-controller');

describe('User Controller Unit Tests', () => {
  it('should register a user (mocked)', async () => {
    const registerUserUseCaseHandler = jest.fn().mockResolvedValue({ insertedId: 'abc123' });
    const makeHttpError = jest.fn((obj) => ({ ...obj }));
    const logEvents = jest.fn();
    const handler = registerUserController({
      registerUserUseCaseHandler,
      makeHttpError,
      logEvents,
    });
    const httpRequest = {
      body: { username: 'testuser', email: 'test@example.com', password: 'pass' },
    };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data).toEqual({ message: 'User registered successfully' });
  });

  it('should login a user (mocked)', async () => {
    const loginUserUseCaseHandler = jest.fn().mockResolvedValue({ accessToken: 'token' });
    const makeHttpError = jest.fn((obj) => ({ ...obj }));
    const logEvents = jest.fn();
    const bcrypt = {};
    const jwt = {};
    const handler = loginUserController({
      loginUserUseCaseHandler,
      UniqueConstraintError: Error,
      InvalidPropertyError: Error,
      makeHttpError,
      logEvents,
      bcrypt,
      jwt,
    });
    const httpRequest = { body: { email: 'test@example.com', password: 'pass' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data).toEqual({ accessToken: 'token' });
  });

  it('should get user profile (mocked)', async () => {
    const findOneUserUseCaseHandler = jest
      .fn()
      .mockResolvedValue({ id: 'u1', username: 'testuser' });
    const makeHttpError = jest.fn((obj) => ({ ...obj }));
    const logEvents = jest.fn();
    const handler = findOneUserController({
      findOneUserUseCaseHandler,
      UniqueConstraintError: Error,
      InvalidPropertyError: Error,
      makeHttpError,
      logEvents,
    });
    const httpRequest = { params: { userId: 'u1' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data).toContain('testuser');
  });

  it('should update a user (mocked)', async () => {
    const updateUserUseCaseHandler = jest.fn().mockResolvedValue({ id: 'u1', username: 'updated' });
    const makeHttpError = jest.fn((obj) => ({ ...obj }));
    const logEvents = jest.fn();
    const handler = updateUserController({
      updateUserUseCaseHandler,
      UniqueConstraintError: Error,
      InvalidPropertyError: Error,
      makeHttpError,
      logEvents,
    });
    const httpRequest = { params: { userId: 'u1' }, body: { username: 'updated' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data).toContain('updated');
  });

  it('should delete a user (mocked)', async () => {
    const deleteUserUseCaseHandler = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const makeHttpError = jest.fn((obj) => ({ ...obj }));
    const logEvents = jest.fn();
    const handler = deleteUserController({
      deleteUserUseCaseHandler,
      UniqueConstraintError: Error,
      InvalidPropertyError: Error,
      makeHttpError,
      logEvents,
    });
    const httpRequest = { params: { userId: 'u1' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data).toContain('deletedCount');
  });

  it('should block a user (mocked)', async () => {
    const blockUserUseCaseHandler = jest.fn().mockResolvedValue({ id: 'u1', blocked: true });
    const makeHttpError = jest.fn((obj) => ({ ...obj }));
    const logEvents = jest.fn();
    const handler = blockUserController({
      blockUserUseCaseHandler,
      UniqueConstraintError: Error,
      InvalidPropertyError: Error,
      makeHttpError,
      logEvents,
    });
    const httpRequest = { params: { userId: 'u1' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data).toContain('blocked');
  });

  it('should unblock a user (mocked)', async () => {
    const unBlockUserUseCaseHandler = jest.fn().mockResolvedValue({ id: 'u1', blocked: false });
    const makeHttpError = jest.fn((obj) => ({ ...obj }));
    const logEvents = jest.fn();
    const handler = unBlockUserController({
      unBlockUserUseCaseHandler,
      UniqueConstraintError: Error,
      InvalidPropertyError: Error,
      makeHttpError,
      logEvents,
    });
    const httpRequest = { params: { userId: 'u1' } };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(201);
    expect(response.data).toContain('blocked');
  });

  it('should handle error on register', async () => {
    const registerUserUseCaseHandler = jest.fn().mockRejectedValue(new Error('DB error'));
    const makeHttpError = jest.fn((obj) => ({ ...obj, statusCode: 500 }));
    const logEvents = jest.fn();
    const handler = registerUserController({
      registerUserUseCaseHandler,
      makeHttpError,
      logEvents,
    });
    const httpRequest = {
      body: { username: 'testuser', email: 'test@example.com', password: 'pass' },
    };
    const response = await handler(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage || response.data).toBeDefined();
  });
});
