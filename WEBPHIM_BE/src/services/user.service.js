const prisma = require('../config/prisma');
const { appError } = require('../utils/appError');

// ADD FAVORITE
const addFavoriteService = async (data) => {
    try {
        console.log("Dữ liệu nhận được:", data);
        
        const favorite = await prisma.favorite_movie.create({
            data: {
                profile_id: data.profileId,
                movie_id: data.movieId,
                notes: data.notes || '' // Đã sửa lỗi chữ 'ndata'
            }
        });

        return favorite;

    } catch (error) {
        console.error("🚨 LỖI GỐC TỪ PRISMA:", error);
        if (error.code === 'P2002') {
            throw new appError('Phim này đã nằm trong danh sách yêu thích rồi!', 400);
        }
        throw new appError('Lỗi khi thêm yêu thích!', 500);
    }
};

// REMOVE FAVORITE
const removeFavoriteService = async (profileId, movieId) => {
    const result = await prisma.favorite_movie.deleteMany({
        where: {
            profile_id: profileId,
            movie_id: movieId
        }
    });

    if (result.count === 0) {
        throw new appError('Phim không có trong danh sách yêu thích!', 400);
    }

    return true;
};

// GET WATCH HISTORY
const getWatchHistoryService = async (profileId) => {
    return await prisma.watch_history.findMany({
        where: { profile_id: profileId },
        orderBy: { last_watched_at: 'desc' },
        take: 10,
        include: {
            episode: {
                include: {
                    season: {
                        include: {
                            movie: true
                        }
                    }
                }
            }
        }
    });
};

// SAVE WATCH HISTORY
const saveWatchHistoryService = async (profileId, body) => {
    const { episode_id, progress_second, is_completed } = body;

    const existing = await prisma.watch_history.findFirst({
        where: {
            profile_id: profileId,
            episode_id: parseInt(episode_id)
        }
    });

    if (existing) {
        return await prisma.watch_history.update({
            where: { id: existing.id },
            data: {
                progress_second: parseInt(progress_second),
                is_completed: is_completed ?? existing.is_completed,
                updated_at: new Date()
            }
        });
    }

    return await prisma.watch_history.create({
        data: {
            profile_id: profileId,
            episode_id: parseInt(episode_id),
            progress_second: parseInt(progress_second),
            is_completed: is_completed ?? false        }
    });
};

// GET FAVORITES
const getMyFavoritesService = async (profileId) => {
    return await prisma.favorite_movie.findMany({
        where: { profile_id: profileId },
        orderBy: { created_at: 'desc' },
        include: {
            movie: {
                select: {
                    id: true,
                    title: true,
                    poster_url: true,
                    release_year: true,
                    age_rating: true
                }
            }
        }
    });
};

module.exports = {
    addFavoriteService,
    removeFavoriteService,
    getWatchHistoryService,
    saveWatchHistoryService,
    getMyFavoritesService
};