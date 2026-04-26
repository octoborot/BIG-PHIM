const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const {
        createMovieSchema,
        updateMovieSchema,
        genreSchema,
        topicSchema,
        createSeasonSchema,
        createEpisodeSchema,
        updateEpisodeSchema
    } = require('../validators/movie.validator');

// Route để lấy 10 bộ phim ngẫu nhiên
router.get('/random', movieController.getRandomMovies);

// Route để lấy chi tiết bộ phim theo ID
router.get('/:id', validateParams(paramId('id')), movieController.getMovieById);

// Route để tạo mới một bộ phim
router.post('/', verifyToken, isAdmin, validate(createMovieSchema), movieController.createMovie);
router.post('/:movieId/genres', verifyToken, isAdmin, validateParams(paramId('movieId')), validate(genreSchema), movieController.assignGenresToMovie);
router.post('/:movieId/topics', verifyToken, isAdmin, validateParams(paramId('movieId')), validate(topicSchema), movieController.assignTopicsToMovie);
router.post('/:movieId/seasons', verifyToken, isAdmin, validateParams(paramId('movieId')), validate(createSeasonSchema), movieController.createSeason);
router.post('/seasons/:seasonId/episodes', verifyToken, isAdmin, validateParams(paramId('seasonId')), validate(createEpisodeSchema), movieController.createEpisode);

router.put('/:movieId/topics', verifyToken, isAdmin, validateParams(paramId('movieId')), movieController.updateMovieTopics);
router.put('/:movieId/genres', verifyToken, isAdmin, validateParams(paramId('movieId')), movieController.updateMovieGenres);
router.put('/:id', verifyToken, isAdmin, validateParams(paramId('id')), validate(updateMovieSchema), movieController.updateMovie);
router.put('/episodes/:id', verifyToken, isAdmin, validateParams(paramId('id')), validate(updateEpisodeSchema), movieController.updateEpisode);

module.exports = router;