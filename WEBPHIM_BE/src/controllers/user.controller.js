const asyncHandler = require('../middlewares/asyncHandler');

const {
    addFavoriteService,
    removeFavoriteService,
    getWatchHistoryService,
    saveWatchHistoryService,
    getMyFavoritesService
} = require('../services/user.service');

// ADD FAVORITE
const addFavorite = asyncHandler(async (req, res) => {
    // Gom dữ liệu từ Token (user) và Body lại thành 1 Object
    const favoriteData = {
        profileId: req.user.profileId,
        movieId: req.body.movieId,
        notes: req.body.notes
    };

    // Truyền đúng 1 tham số (Object) sang Service
    const data = await addFavoriteService(favoriteData);

    res.json({
        success: true,
        message: 'Đã thêm vào yêu thích!',
        data
    });
});

// REMOVE FAVORITE
const removeFavorite = asyncHandler(async (req, res) => {
    await removeFavoriteService(
        req.user.profileId,
        req.params.movieId
    );

    res.json({
        success: true,
        message: 'Đã xóa khỏi yêu thích!'
    });
});

// GET HISTORY
const getWatchHistory = asyncHandler(async (req, res) => {
    const data = await getWatchHistoryService(req.user.profileId);

    res.json({
        success: true,
        data
    });
});

// SAVE HISTORY
const saveWatchHistory = asyncHandler(async (req, res) => {
    const data = await saveWatchHistoryService(
        req.user.profileId,
        req.body
    );

    res.json({
        success: true,
        message: 'Đã lưu tiến độ!',
        data
    });
});

// GET FAVORITES
const getMyFavorites = asyncHandler(async (req, res) => {
    const data = await getMyFavoritesService(req.user.profileId);

    res.json({
        success: true,
        data
    });
});

module.exports = {
    addFavorite,
    removeFavorite,
    getWatchHistory,
    saveWatchHistory,
    getMyFavorites
};