const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/movies', searchController.searchMovies);

module.exports = router;