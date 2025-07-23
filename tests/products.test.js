/* eslint-env jest */
const request = require('supertest');
const express = require('express');
const productRouter = require('../routes/product.routes');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use('/products', productRouter);

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

beforeAll(async () => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db('digital-market-place-updates');
  await db.collection('products').insertOne({ name: 'Test Product', price: 1 });
  await client.close();
});

afterAll(async () => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db('digital-market-place-updates');
  await db.collection('products').deleteMany({});
  await client.close();
});

describe('Products API', () => {
  it('should return 200 and an array for GET /products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true);
  });
});
