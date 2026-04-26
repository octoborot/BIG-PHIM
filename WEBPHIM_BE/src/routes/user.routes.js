const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const {
    addFavoriteSchema,
    saveWatchHistorySchema
} = require('../validators/user.validator');

router.post('/favorites', verifyToken, userController.addFavorite);
router.delete('/favorites/:movieId', verifyToken, validateParams(paramId('movieId')), userController.removeFavorite);
router.get('/history', verifyToken, userController.getWatchHistory);
router.post('/history', verifyToken, validate(saveWatchHistorySchema), userController.saveWatchHistory);
router.get('/favorites', verifyToken, userController.getMyFavorites);

module.exports = router;