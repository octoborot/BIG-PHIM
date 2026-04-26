// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import tất cả các route lẻ
const movieRoutes = require('./movie.routes');
const topicRoutes = require('./topic.routes');
const genreRoutes = require('./genre.routes');
const seasonRoutes = require('./season.routes');
const episodeRoutes = require('./episode.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const profileRoutes = require('./profile.routes');
const notificationRoutes = require('./notification.routes');
const adminRoutes = require('./admin.routes');
const searchRoutes = require('./search.routes');

// Gắn tiền tố cho từng nhóm
router.use('/movies', movieRoutes);
router.use('/topics', topicRoutes);
router.use('/genres', genreRoutes);
router.use('/seasons', seasonRoutes);
router.use('/episodes', episodeRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/search', searchRoutes);

module.exports = router;