const prisma = require('../config/prisma');
const appError = require('../utils/appError');

const getSeasonsByMovieIdService = async (movieId) => {
    return prisma.season.findMany({
        where: { movie_id: movieId},
        include: {
            episode: true
        },
        orderBy: { season_number: 'asc'}
    });
};

const updateSeasonService = async (seasonId, data) => {
    try{
        return await prisma.season.update({
            where: { id: seasonId },
            data: {
                season_number: data.season_number,
                title: data.title,
                description: data.description,
                updated_at: new Date()
            }
        });
    } catch (error) {
        if(error.code === 'P2025'){
            throw new appError('Không tìm thấy Season này!', 404);
        }
        if(error.code === 'P2002'){
            throw new appError('Tên chủ đề đã tồn tại!', 400);
        }
        throw error;
    }
};

const deleteSeasonService = async (seasonId) => {
    try {
        await prisma.season.delete({
            where: { id: seasonId }
        });
        return true;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new appError('Không tìm thấy Season này!', 404);
        }
        throw error;
    }
};

module.exports = {
    getSeasonsByMovieIdService,
    updateSeasonService,
    deleteSeasonService
};