const prisma = require('../config/prisma');
const appError = require('../utils/appError');

const getEpisodesBySeasonIdService = async (seasonId) => {
    return prisma.episode.findMany({
        where: { season_id: seasonId },
        orderBy: { episode_number: 'asc' }
    });
};

const updateEpisodeService = async (episodeId, data) => {
    try {
        return await prisma.episode.update({
            where: { id: episodeId },
            data: {
                episode_number: parseInt(data.episode_number),
                title: data.title,
                video_url: data.video_url,
                duration: parseInt(data.duration) || 0,
                updated_at: new Date()
            }
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw new appError('Không tìm thấy tập phim này!', 404);
        }

        if (error.code === 'P2002') {
            throw new appError('Tập phim bị trùng số thứ tự!', 400);
        }

        throw error;
    }
};

const deleteEpisodeService = async (episodeId) => {
    try {
        await prisma.episode.delete({
            where: { id: episodeId }
        });
        return true;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new appError('Không tìm thấy tập phim này!', 404);
        }
        throw error;
    }
};

module.exports = {
    getEpisodesBySeasonIdService,
    updateEpisodeService,
    deleteEpisodeService
};