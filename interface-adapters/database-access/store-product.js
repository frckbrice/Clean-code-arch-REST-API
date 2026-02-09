'use strict';

const { ObjectId, DBRef } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const { log } = require('../middlewares/loggers/logger');

/**
 * Inserts a new product into the products collection.
 * @param {Object} productData - Product document.
 * @param {Function} dbconnection - Async function returning DB instance.
 * @param {Function} logEvents - Logger for file output.
 * @returns {Promise<import('mongodb').InsertOneResult|null>}
 */
async function createProduct(productData, dbconnection, logEvents) {
  const db = await dbconnection();
  try {
    const newProduct = await db.collection('products').insertOne({ ...productData });
    return newProduct;
  } catch (error) {
    log.error('Error from product DB handler:', error.message);
    logEvents(
      `${error.no}:${error.code}\t${error.ReferenceError || error.TypeError}\t${error.message}`,
      'product.log'
    );
  }
}

/**
 * Finds a single product by ID.
 * @param {{ productId: string, dbconnection: Function, logEvents: Function }} opts
 * @returns {Promise<Object|null>}
 */
const findOneProduct = async ({ productId, dbconnection, logEvents }) => {
  const db = await dbconnection();
  try {
    const product = await db.collection('products').findOne(
      { _id: new ObjectId(productId) },
      {
        projection: {
          _id: 1,
          title: 1,
          description: 1,
          price: 1,
          category: 1,
          brand: 1,
          inventory: 1,
          creationDate: 1,
          expirationDate: 1,
          origin: 1,
          variations: 1,
          salePrice: 1,
          slug: 1,
          totalRatings: 1,
          totalReviews: 1,
          totalSales: 1,
          rateAverage: 1,
          lastModified: 1,
          instock: 1,
        },
      }
    );
    if (!product) {
      return null;
    }

    const { _id, ...rest } = product;
    const id = _id.toString();
    delete rest._id;
    return { id, ...rest };
  } catch (error) {
    log.error('Error from product DB handler:', error.message);
    logEvents(
      `${error.no}:${error.code}\t${error.ReferenceError || error.TypeError}\t${error.message}`,
      'product.log'
    );
    return null;
  }
};

/**
 * Finds products with optional filters and pagination.
 * @param {{ dbconnection: Function, logEvents: Function, category?: string, minPrice?: number, maxPrice?: number, page?: number, perPage?: number, searchTerm?: string }} opts
 * @returns {Promise<{ data: Object[], totalProducts: number, totalPages: number, page: number, perPage: number }|[]>}
 */
const findAllProducts = async ({ dbconnection, logEvents, ...filterOptions }) => {
  const { category, minPrice, maxPrice, page, perPage, searchTerm } = filterOptions;

  const filter = {};
  if (category) filter.category = category;
  if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
  if (maxPrice) filter.price = { $lte: parseFloat(maxPrice) };
  if (searchTerm) filter.$text = { $search: searchTerm };

  const projection = {
    _id: 0,
    title: 1,
    description: 1,
    price: 1,
    category: 1,
    brand: 1,
    creationDate: 1,
    expirationDate: 1,
    origin: 1,
    variations: 1,
    salePrice: 1,
    slug: 1,
    lastModified: 1,
    instock: 1,
  };

  const offset = (page - 1) * perPage;
  const db = await dbconnection();

  try {
    const allProducts = await db
      .collection('products')
      .find(filter)
      .project(projection)
      .skip(offset)
      .limit(Number(perPage))
      .toArray();

    const totalProducts = await db.collection('products').countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / perPage);
    const products = allProducts.map((product) => ({ ...product, id: product._id.toString() }));

    return {
      data: products,
      totalProducts,
      totalPages,
      page,
      perPage,
    };
  } catch (error) {
    log.error('Error from product DB handler:', error.message);
    logEvents(
      `${error.no}:${error.code}\t${error.ReferenceError || error.TypeError}\t${error.message}`,
      'product.log'
    );
    return [];
  }
};

/**
 * Deletes a product by ID.
 * @param {{ productId: import('mongodb').ObjectId, dbconnection: Function, logEvents: Function }} opts
 * @returns {Promise<{ id: import('mongodb').ObjectId }|null>}
 */
const deleteProduct = async ({ productId, dbconnection, logEvents }) => {
  const db = await dbconnection();
  try {
    const result = await db.collection('products').deleteOne({ _id: productId });
    return result.deletedCount > 0 ? { id: productId } : null;
  } catch (error) {
    log.error('Error from product DB handler:', error.message);
    logEvents(
      `${error.no}:${error.code}\t${error.ReferenceError || error.TypeError}\t${error.message}`,
      'product.log'
    );
    return null;
  }
};

/**
 * Updates a product by ID.
 * @param {{ productId: string, dbconnection: Function, logEvents: Function }} opts
 * @param {Object} productData - Fields to update.
 * @returns {Promise<import('mongodb').ModifyResult<Object>>}
 */
const updatedProduct = async ({ productId, dbconnection, logEvents, ...productData }) => {
  const db = await dbconnection();
  try {
    const result = await db
      .collection('products')
      .findOneAndUpdate(
        { _id: new ObjectId(productId) },
        { $set: { ...productData } },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    log.error('Error from product DB handler:', error.message);
    logEvents(
      `${error.no}:${error.code}\t${error.ReferenceError || error.TypeError}\t${error.message}`,
      'productDBErr.log'
    );
    throw new Error(error.message || error.ReferenceError);
  }
};

/**
 * Creates a rating and updates the product's rating aggregates in a transaction.
 * @param {{ logEvents: Function, productId: string, userId: string, ratingValue: number }} ratingModel
 * @returns {Promise<Object>}
 */
const rateProduct = async ({ logEvents, ...ratingModel }) => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const client = new MongoClient(mongoUri);
  const session = client.startSession();

  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };

  const lastModified = Date.now();
  const filter = { _id: new ObjectId(ratingModel.productId) };
  const dbName = process.env.MONGO_DB_NAME || 'digital-market-place-updates';

  try {
    return await session.withTransaction(async () => {
      const productCollection = client.db(dbName).collection('products');
      const ratingCollection = client.db(dbName).collection('ratings');
      const existingProduct = await productCollection.findOne(
        { _id: new ObjectId(ratingModel.productId) },
        { session }
      );
      if (!existingProduct) {
        session.abortTransaction();
        return {
          error: {
            code: 404,
            message: 'Product not found!',
          },
        };
      }

      const existingRating = await ratingCollection.findOne(
        { userId: ratingModel.userId, productId: ratingModel.productId },
        { session }
      );
      if (existingRating) {
        session.abortTransaction();
        return {
          error: {
            code: 409,
            message: 'You have already rated this product!',
          },
        };
      }

      const newRating = await ratingCollection.insertOne(ratingModel, { session });
      const { totalRatings } = existingProduct;
      const totalReviews = totalRatings?.reduce((sum, rating) => sum + rating, 0) || 0;
      const newAverage = totalReviews
        ? totalRatings?.reduce((sum, rating, index) => sum + rating * (index + 1), 0) / totalReviews
        : existingProduct.rateAverage;

      for (let index = 0; index < 5; index++) {
        if (ratingModel.ratingValue === index + 1) {
          totalRatings[index] = totalRatings[index] + 1;
        }
      }
      const updateProduct = {
        rateAverage: newAverage,
        lastModified,
        totalRatings,
      };

      const updatedProduct = await productCollection.findOneAndUpdate(
        filter,
        {
          $push: {
            latestRating: new DBRef('ratings', newRating.insertedId),
          },
          $inc: {
            totalReviews: 1,
          },
          $set: updateProduct,
        },
        { session }
      );
      return { updatedProduct, newRating };
    }, transactionOptions);
  } catch (error) {
    log.error('Error from product DB handler:', error.message);
    logEvents(
      `${error.no}:${error.code}\t${error.ReferenceError || error.TypeError}\t${error.message}`,
      'productDBErr.log'
    );
    throw new Error(error.message || error.ReferenceError || error.TypeError);
  } finally {
    session.endSession();
    await client.close();
  }
};

module.exports = ({ dbconnection, logEvents }) => {
  return Object.freeze({
    createProductDbHandler: async (productData) =>
      createProduct(productData, dbconnection, logEvents),
    findOneProductDbHandler: async ({ productId }) =>
      findOneProduct({ productId, dbconnection, logEvents }),
    findAllProductsDbHandler: async (filterOptions) =>
      findAllProducts({ dbconnection, logEvents, ...filterOptions }),
    deleteProductDbHandler: async ({ productId }) =>
      deleteProduct({ productId, dbconnection, logEvents }),
    updateProductDbHandler: async ({ productId, ...productData }) =>
      updatedProduct({ productId, dbconnection, logEvents, ...productData }),
    rateProductDbHandler: async (ratingModel) => rateProduct({ logEvents, ...ratingModel }),
  });
};
