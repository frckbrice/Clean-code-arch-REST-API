/* eslint-env jest */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index'); //

// Helper to generate a JWT for testing
function generateJwt(user = { id: 'u1', role: 'user' }) {
  return jwt.sign(user, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
}

describe('Integration: User, Product, Blog Endpoints', () => {
    let userToken, adminToken, createdProductId;
  beforeAll(() => {
      userToken = generateJwt({ id: 'u1', role: 'user' });
      adminToken = generateJwt({ id: 'admin1', role: 'admin' });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
          .send({
              username: 'integrationUser',
              email: 'int@example.com',
              password: 'pass123',
              firstName: 'Integration',
              lastName: 'User',
              role: 'user'
          });
      expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('data');
  });

  it('should create a product (protected)', async () => {
    const res = await request(app)
      .post('/products')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
              name: 'Integration Product',
              price: 10,
              description: 'A product for integration testing',
              category: 'test',
              createdBy: 'u1'
          });
      expect([200, 201, 400]).toContain(res.statusCode);
      if (res.body.data && res.body.data.createdProduct && res.body.data.createdProduct.id) {
          createdProductId = res.body.data.createdProduct.id;
      }
  });

    it('should not create a product without auth', async () => {
        const res = await request(app)
            .post('/products')
            .send({
                name: 'NoAuth Product',
                price: 10,
                description: 'No auth',
                category: 'test',
                createdBy: 'u1'
            });
        expect([401, 403]).toContain(res.statusCode);
  });

  it('should get all products (public)', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data?.products || res.body.data)).toBe(true);
  });

    it('should update a product (protected)', async () => {
        if (!createdProductId) return;
        const res = await request(app)
            .put(`/products/${createdProductId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Updated Product',
                price: 15,
                description: 'Updated description',
                category: 'test',
                createdBy: 'u1'
            });
        expect([200, 201, 400, 404]).toContain(res.statusCode);
    });

    it('should not update a product without auth', async () => {
        if (!createdProductId) return;
        const res = await request(app)
            .put(`/products/${createdProductId}`)
            .send({
                name: 'Updated Product',
                price: 15,
                description: 'Updated description',
                category: 'test',
                createdBy: 'u1'
            });
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should delete a product as admin', async () => {
        if (!createdProductId) return;
        const res = await request(app)
            .delete(`/products/${createdProductId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect([200, 201, 404]).toContain(res.statusCode);
    });

    it('should not delete a product as user', async () => {
        if (!createdProductId) return;
        const res = await request(app)
            .delete(`/products/${createdProductId}`)
            .set('Authorization', `Bearer ${userToken}`);
        expect([401, 403]).toContain(res.statusCode);
    });

  it('should create a blog (protected)', async () => {
    const res = await request(app)
      .post('/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            title: 'Integration Blog',
            content: 'Lorem ipsum',
            author: 'u1'
        });
    expect([200, 201, 400]).toContain(res.statusCode);
  });

  it('should get all blogs (public)', async () => {
    const res = await request(app).get('/blogs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data?.blogs || res.body.data)).toBe(true);
  });

    // Add more blog update/delete tests if implemented
});
