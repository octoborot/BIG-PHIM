const {
    getSeasonsByMovieIdService,
    updateSeasonService,
    deleteSeasonService
} = require('../services/season.service');

const getSeasonsByMovieId = async (req, res) => {
    try {
        const movieId = parseInt(req.params.movieId);

        const seasons = await getSeasonsByMovieIdService(movieId);

        res.json({
            success: true,
            data: seasons
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateSeason = async (req, res) => {
    try {
        const seasonId = parseInt(req.params.id);
        const updatedSeason = await updateSeasonService(
            seasonId,
            req.body
        );

        res.json({
            success: true,
            message: 'Cập nhật Season thành công!',
            data: updatedSeason
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteSeason = async (req, res) => {
    try {
        const seasonId = parseInt(req.params.id);

        await deleteSeasonService(seasonId);

        res.json({
            success: true,
            message: 'Đã xóa Season thành công!'
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getSeasonsByMovieId,
    updateSeason,
    deleteSeason
};