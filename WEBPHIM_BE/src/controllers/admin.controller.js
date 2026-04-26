const asyncHandler = require('../middlewares/asyncHandler');

const {
    getUnlockedAccountsService,
    getAdminStatsService,
    getRecentUsersService,
    toggleUserLockService
} = require('../services/admin.service');

// GET UNLOCKED
const getUnlockedAccounts = asyncHandler(async (req, res) => {
    const data = await getUnlockedAccountsService();

    res.json({
        success: true,
        data
    });
});

// GET STATS
const getAdminStats = asyncHandler(async (req, res) => {
    const data = await getAdminStatsService();

    res.json({
        success: true,
        data
    });
});

// RECENT USERS
const getRecentUsers = asyncHandler(async (req, res) => {
    const data = await getRecentUsersService();

    res.json({
        success: true,
        data
    });
});

// TOGGLE LOCK
const toggleUserLock = asyncHandler(async (req, res) => {
    const result = await toggleUserLockService(
        req.user,
        req.params.id,
        req.body
    );

    res.json({
        success: true,
        message: result.message
    });
});

module.exports = {
    getUnlockedAccounts,
    getAdminStats,
    getRecentUsers,
    toggleUserLock
};