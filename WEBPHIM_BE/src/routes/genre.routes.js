const express = require('express');
const genreRoutes = express.Router();
const genreController = require('../controllers/genre.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const { createGenreSchema,
        updateGenreSchema
    } = require('../validators/genre.validator');

genreRoutes.get('/', genreController.getGenres);
genreRoutes.post('/', verifyToken, isAdmin, validate(createGenreSchema), genreController.createGenre);
genreRoutes.put('/:id', verifyToken, isAdmin, validateParams(paramId('id')), validate(updateGenreSchema), genreController.updateGenre);
genreRoutes.delete('/:id', verifyToken, isAdmin, validateParams(paramId('id')), genreController.deleteGenre);

module.exports = genreRoutes;