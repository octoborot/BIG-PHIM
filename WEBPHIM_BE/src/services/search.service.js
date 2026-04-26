const prisma = require('../config/prisma');
const { buildMovieWhere } = require('../utils/searcQueryBuilder');
const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../constants/pagination');

const searchMoviesService = async (query) => {
    const page = parseInt(query.page) || DEFAULT_PAGE;
    const limit = parseInt(query.limit) || DEFAULT_LIMIT;

    const skip = (page - 1) * limit;

    // 👉 dùng builder
    const whereCondition = buildMovieWhere(query);

    const [movies, totalMovies] = await Promise.all([
        prisma.movie.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                title: true,
                orignal_title: true,
                poster_url: true,
                release_year: true,
                age_rating: true,
                country: true,
                trailer_url: true,
                status: true,
                type: true,
                movie_genre: {
                    select: { genre: true }
                },
                movie_topic: {
                    select: { topic: true }
                }
            }
        }),
        prisma.movie.count({ where: whereCondition })
    ]);

    return {
        movies,
        pagination: {
            totalMovies,
            totalPages: Math.ceil(totalMovies / limit),
            current_page: page,
            page_size: limit
        }
    };
};

module.exports = {
    searchMoviesService
};