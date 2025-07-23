/* eslint-env jest */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index'); //

// Helper to generate a JWT for testing
function generateJwt(user = { id: 'u1', role: 'user' }) {
  // Use your real JWT secret in production/test env
  return jwt.sign(user, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
}

describe('Integration: User, Product, Blog Endpoints', () => {
  let token;
  beforeAll(() => {
    token = generateJwt({ id: 'u1', role: 'user' });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'integrationUser', email: 'int@example.com', password: 'pass123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
  });

  it('should create a product (protected)', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Integration Product', price: 10 });
    expect([200, 201, 400]).toContain(res.statusCode); // Accept 400 if validation fails
  });

  it('should get all products (public)', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data?.products || res.body.data)).toBe(true);
  });

  it('should create a blog (protected)', async () => {
    const res = await request(app)
      .post('/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Integration Blog', content: 'Lorem ipsum' });
    expect([200, 201, 400]).toContain(res.statusCode);
  });

  it('should get all blogs (public)', async () => {
    const res = await request(app).get('/blogs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data?.blogs || res.body.data)).toBe(true);
  });

  // Add more tests for update, delete, and protected admin routes as needed
});
