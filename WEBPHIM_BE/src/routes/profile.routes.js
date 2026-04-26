const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const {verifyToken, isAdmin} = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const {
    createProfileSchema,
    updateMyProfileSchema
} = require('../validators/profile.validator');

router.get('/', verifyToken, isAdmin, profileController.getAllProfiles);
router.post('/profiles', verifyToken, validate(createProfileSchema), profileController.createProfile);
router.patch('/accounts/:id/lock', verifyToken, isAdmin, validateParams(paramId('id')), profileController.toggleLockAccount);
router.get('/me', verifyToken, profileController.getProfileByAccountId);
router.put('/me', verifyToken, validate(updateMyProfileSchema), profileController.updateMyProfile);

module.exports = router;