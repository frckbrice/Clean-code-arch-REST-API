const { ObjectId } = require('mongodb');

function toObjectId(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return new ObjectId(id);
}

module.exports = function makeBlogDb({ dbconnection }) {
  return Object.freeze({
    createBlog: async (blogData) => {
      try {
        const db = await dbconnection();
        const result = await db.collection('blogs').insertOne(blogData);
        return { ...blogData, id: result.insertedId };
      } catch (error) {
        throw new Error('DB error (createBlog): ' + error.message);
      }
    },
    findAllBlogs: async () => {
      try {
        const db = await dbconnection();
        return db.collection('blogs').find({}).toArray();
      } catch (error) {
        throw new Error('DB error (findAllBlogs): ' + error.message);
      }
    },
    findOneBlog: async ({ blogId }) => {
      try {
        const db = await dbconnection();
        const _id = toObjectId(blogId);
        return db.collection('blogs').findOne({ _id });
      } catch (error) {
        throw new Error('DB error (findOneBlog): ' + error.message);
      }
    },
    updateBlog: async ({ blogId, ...updateData }) => {
      try {
        const db = await dbconnection();
        const _id = toObjectId(blogId);
        await db.collection('blogs').updateOne({ _id }, { $set: updateData });
        return db.collection('blogs').findOne({ _id });
      } catch (error) {
        throw new Error('DB error (updateBlog): ' + error.message);
      }
    },
    deleteBlog: async ({ blogId }) => {
      try {
        const db = await dbconnection();
        const _id = toObjectId(blogId);
        const result = await db.collection('blogs').deleteOne({ _id });
        return { deletedCount: result.deletedCount };
      } catch (error) {
        throw new Error('DB error (deleteBlog): ' + error.message);
      }
    },
  });
};
