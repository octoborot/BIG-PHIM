const {
    getEpisodesBySeasonIdService,
    updateEpisodeService,
    deleteEpisodeService
} = require('../services/episode.service');

const getEpisodesBySeasonId = async (req, res) => {
    try {
        const seasonId = parseInt(req.params.seasonId);

        const episodes = await getEpisodesBySeasonIdService(seasonId);

        res.json({
            success: true,
            data: episodes
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateEpisode = async (req, res) => {
    try {
        const episodeId = parseInt(req.params.episodeId);

        const updatedEpisode = await updateEpisodeService(
            episodeId,
            req.body
        );

        res.json({
            success: true,
            message: 'Cập nhật thành công',
            data: updatedEpisode
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteEpisode = async (req, res) => {
    try {
        const episodeId = parseInt(req.params.episodeId);

        await deleteEpisodeService(episodeId);

        res.json({
            success: true,
            message: 'Xóa Tập phim thành công!'
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getEpisodesBySeasonId,
    updateEpisode,
    deleteEpisode
};