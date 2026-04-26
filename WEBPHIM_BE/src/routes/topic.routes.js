const express = require('express');
const topicRoutes = express.Router();
const topicController = require('../controllers/topic.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const {
    createTopicSchema,
    updateTopicSchema
} = require('../validators/topic.validator');

topicRoutes.get('/', topicController.getTopics);
topicRoutes.post('/', verifyToken, isAdmin, validate(createTopicSchema), topicController.createTopic);
topicRoutes.put('/:id', verifyToken, isAdmin, validateParams(paramId('id')), validate(updateTopicSchema), topicController.updateTopic);
topicRoutes.delete('/:id', verifyToken, isAdmin, validateParams(paramId('id')), topicController.deleteTopic);

module.exports = topicRoutes;