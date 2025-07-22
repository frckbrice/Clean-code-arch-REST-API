const { dbconnection } = require('./db-connection');
require('dotenv').config();

// all the collections stated here are created if not exist.
module.exports = async function setupDb() {
  console.log('Setting up database indexes...');
  const db = await dbconnection();

  // PRODUCTS
  let allProductsIndexName = [];
  try {
    allProductsIndexName = await db.collection('products').listIndexes().toArray();
  } catch (err) {
    if (err.codeName === 'NamespaceNotFound') {
      await db.collection('products').insertOne({ __seed: true });
      await db.collection('products').deleteOne({ __seed: true });
      allProductsIndexName = [];
    } else {
      throw err;
    }
  }

  let indexArr = [];
  allProductsIndexName.forEach((element) => {
    if (element.name === 'productTextIndex' || element.name === 'productUniqueIndex') {
      return;
    }
    indexArr = [
      ...indexArr,
      db.collection('products').createIndexes([
        {
          key: {
            title: 'text',
            description: 'text',
            category: 'text',
            seoKeywords: 'text',
            origin: 'text',
            variations: 'text',
            highlights: 'text',
            brand: 'text',
          },
          name: 'productTextIndex',
          default_language: 'english',
          weights: { description: 10, title: 3 },
        },
        { key: { title: 1 }, name: 'productUniqueIndex' },
      ]),
    ];
  });

  // USERS
  let allUsersIndexName = [];
  try {
    allUsersIndexName = await db.collection('users').listIndexes().toArray();
  } catch (err) {
    if (err.codeName === 'NamespaceNotFound') {
      await db.collection('users').insertOne({ __seed: true });
      await db.collection('users').deleteOne({ __seed: true });
      allUsersIndexName = [];
    } else {
      throw err;
    }
  }
  allUsersIndexName.forEach((element) => {
    if (element.name === 'userUniqueIndex') {
      return;
    }
    indexArr = [
      ...indexArr,
      db
        .collection('users')
        .createIndexes([{ key: { email: 1 }, unique: true, name: 'userUniqueIndex' }]),
    ];
  });

  // RATINGS
  let allRatingsIndexName = [];
  try {
    allRatingsIndexName = await db.collection('ratings').listIndexes().toArray();
  } catch (err) {
    if (err.codeName === 'NamespaceNotFound') {
      await db.collection('ratings').insertOne({ __seed: true });
      await db.collection('ratings').deleteOne({ __seed: true });
      allRatingsIndexName = [];
    } else {
      throw err;
    }
  }
  allRatingsIndexName.forEach((element) => {
    if (element.name === 'ratingsUniqueIndex') {
      // db.collection('ratings').dropIndex('ratingsUniqueIndex');
      return;
    }
    indexArr = [
      ...indexArr,
      db
        .collection('ratings')
        .createIndexes([{ key: { userId: 1, postId: 1 }, name: 'ratingUniqueIndex' }]),
    ];
  });

  await Promise.all([...indexArr]);
};
