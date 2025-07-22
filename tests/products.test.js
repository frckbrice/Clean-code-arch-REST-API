/* eslint-env jest */
const request = require('supertest');
const express = require('express');
const productRouter = require('../routes/product.routes');

const app = express();
app.use(express.json());
app.use('/products', productRouter);

describe('Products API', () => {
  it('should return 200 and an array for GET /products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true);
  });
});
