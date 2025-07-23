const express = require('express');
const router = express.Router();

const authRouter = require('./auth.router');
const userProfileRouter = require('./user-profile.router');
const productRouter = require('./product.routes');
const blogRouter = require('./blog.router');
// const ratingRouter = require('./rating.router'); // Uncomment when implemented

router.use('/auth', authRouter);
router.use('/users', userProfileRouter);
router.use('/products', productRouter);
router.use('/blogs', blogRouter);
// router.use('/ratings', ratingRouter);

module.exports = router;
