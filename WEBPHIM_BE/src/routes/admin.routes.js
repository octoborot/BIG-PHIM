const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const {verifyToken, isAdmin} = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const validateParams = require('../middlewares/validateParams');
const { paramId } = require('../validators/common.validator');
const {
    toggleUserLockSchema,
    accountIdParamSchema
} = require('../validators/admin.validator');


router.get('/unlocked-accounts', verifyToken, isAdmin, adminController.getUnlockedAccounts);
router.get('/stats', verifyToken, isAdmin, adminController.getAdminStats);
router.get('/recent-users', verifyToken, isAdmin, adminController.getRecentUsers);
router.patch('/:id/lock', validateParams(paramId('id')), validate(toggleUserLockSchema), verifyToken, isAdmin, adminController.toggleUserLock);

module.exports = router;