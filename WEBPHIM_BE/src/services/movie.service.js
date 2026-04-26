const prisma = require('../config/prisma');
const { appError } = require('../utils/appError');

// RANDOM MOVIES
const getRandomMovieService = async () => {
    return prisma.$queryRaw`
        SELECT id, title, poster_url, age_rating, release_year 
        FROM public.movie 
        ORDER BY RANDOM() 
        LIMIT 10;
    `;
};

// GET MOVIE BY ID
const getMovieByIdService = async (id) => {
    try {
        const movieId = parseInt(id);

        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
            include: {
                movie_genre: {
                    include: { genre: true }
                },
                season: {
                    include: { episode: true }
                }
            }
        });

        if (!movie) {
            throw new appError('Không tìm thấy bộ phim này!', 404);
        }

        return movie;

    } catch (error) {
        throw error instanceof appError
            ? error
            : new appError(error.message, 500);
    }
};

// CREATE MOVIE
const createMovieService = async (data) => {
    try {
        return await prisma.movie.create({
            data: {
                ...data,
                release_year: new Date(data.release_year)
            }
        });
    } catch (error) {
        throw new appError('Lỗi khi tạo phim!', 500);
    }
};

// ASSIGN GENRES
const assignGenresToMovieService = async (movieId, genre_ids) => {
    if (!Array.isArray(genre_ids)) {
        throw new appError('genre_ids phải là một mảng!', 400);
    }

    const dataToInsert = genre_ids.map(id => ({
        movie_id: parseInt(movieId),
        genre_id: id
    }));

    return await prisma.movie_genre.createMany({
        data: dataToInsert,
        skipDuplicates: true
    });
};

// UPDATE GENRES
const updateMovieGenreService = async (movieId, genre_ids) => {
    if (!Array.isArray(genre_ids)) {
        throw new appError('genre_ids phải là một mảng!', 400);
    }

    await prisma.$transaction([
        prisma.movie_genre.deleteMany({
            where: { movie_id: parseInt(movieId) }
        }),
        prisma.movie_genre.createMany({
            data: genre_ids.map(id => ({
                movie_id: parseInt(movieId),
                genre_id: id
            }))
        })
    ]);

    return { success: true };
};

// ASSIGN TOPICS
const assignTopicsToMovieService = async (movieId, topic_ids) => {
    const movie_id = parseInt(movieId);

    if (!Array.isArray(topic_ids)) {
        throw new appError('topic_ids phải là một mảng!', 400);
    }

    if (topic_ids.length === 0) {
        throw new appError('Vui lòng chọn ít nhất 1 chủ đề!', 400);
    }

    const dataToInsert = topic_ids.map(id => ({
        movie_id,
        topic_id: id
    }));

    return await prisma.movie_topic.createMany({
        data: dataToInsert,
        skipDuplicates: true
    });
};

// UPDATE TOPICS
const updateMovieTopicService = async (movieId, topic_ids) => {
    const id = parseInt(movieId);

    if (!Array.isArray(topic_ids)) {
        throw new appError('topic_ids phải là một mảng!', 400);
    }

    await prisma.$transaction([
        prisma.movie_topic.deleteMany({
            where: { movie_id: id }
        }),
        ...(topic_ids.length > 0
            ? [
                prisma.movie_topic.createMany({
                    data: topic_ids.map(topicId => ({
                        movie_id: id,
                        topic_id: topicId
                    }))
                })
            ]
            : [])
    ]);

    return { success: true };
};

// CREATE SEASON
const createSeasonService = async (movieId, data) => {
    return await prisma.season.create({
        data: {
            movie_id: parseInt(movieId),
            season_number: data.season_number || 1,
            title: data.title || 'Phần 1',
            description: data.description || ''
        }
    });
};

// CREATE EPISODE
const createEpisodeService = async (seasonId, data) => {
    return await prisma.episode.create({
        data: {
            season_id: parseInt(seasonId),
            episode_number: data.episode_number,
            title: data.title,
            video_url: data.video_url,
            duration: data.duration
        }
    });
};

// UPDATE MOVIE
const updateMovieService = async (id, data) => {
    return await prisma.movie.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            release_year: new Date(data.release_year)
        }
    });
};

// UPDATE EPISODE
const updateEpisodeService = async (id, data) => {
    return await prisma.episode.update({
        where: { id: parseInt(id) },
        data
    });
};

module.exports = {
    getRandomMovieService,
    getMovieByIdService,
    createMovieService,
    createSeasonService,
    createEpisodeService,
    updateMovieService,
    updateEpisodeService,
    assignGenresToMovieService,
    updateMovieGenreService,
    assignTopicsToMovieService,
    updateMovieTopicService
};