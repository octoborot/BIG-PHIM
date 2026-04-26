const express = require('express');
const router = express.Router();
const seasonController = require('../controllers/season.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const { updateSeasonSchema } = require('../validators/season.validator');

router.get('/movie/:movieId', validateParams(paramId('movieId')), seasonController.getSeasonsByMovieId);
router.put('/:id', verifyToken, isAdmin, validateParams(paramId('id')), validate(updateSeasonSchema), seasonController.updateSeason);
router.delete('/:id', verifyToken, isAdmin, validateParams(paramId('id')), seasonController.deleteSeason);

module.exports = router;