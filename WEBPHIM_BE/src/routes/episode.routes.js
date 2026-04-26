const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episode.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const { updateEpisodeSchema } = require('../validators/episode.validator');

router.get(
    '/season/:seasonId',
    validateParams(paramId('seasonId')),
    episodeController.getEpisodesBySeasonId
);

// UPDATE
router.put(
    '/:episodeId',
    validateParams(paramId('episodeId')),
    validate(updateEpisodeSchema),
    verifyToken,
    isAdmin,
    episodeController.updateEpisode
);

// DELETE
router.delete(
    '/:episodeId',
    validateParams(paramId('episodeId')),
    verifyToken,
    isAdmin,
    episodeController.deleteEpisode
);

module.exports = router;