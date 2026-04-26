const { getRandomMovieService,
    getMovieByIdService,
    createMovieService,
    createSeasonService,
    createEpisodeService,
    updateMovieService,
    updateEpisodeService,
    assignGenresToMovieService,
    updateMovieGenreService,
    assignTopicsToMovieService,
    updateMovieTopicService }
    = require('../services/movie.service');

const getRandomMovies = async (req, res) => {
    try{
        const randomMovies = await getRandomMovieService();
        res.json({ success: true, data: randomMovies });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const getMovieById = async (req, res) => {
    try{
        const {id} = req.params;
        const movie = await getMovieByIdService(id);
        res.json({success: true, data: movie});
    } catch(error){
        return res.status(error.statusCode || 500).json({success: false, message: error.message});
    }
};


const createMovie = async (req, res) => {
    try {
        const { title, orignal_title, description, type, release_year, country, poster_url, trailer_url, age_rating, status } = req.body;

        const newMovie = await createMovieService({ title, orignal_title, description, type, release_year, country, poster_url, trailer_url, age_rating, status });
        res.json({ success: true, message: 'Thêm phim thành công!', data: newMovie });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};


const assignGenresToMovie = async (req, res) => {
    try {
        const result = await assignGenresToMovieService(
            req.params.movieId,
            req.body.genre_ids
        );

        res.json({
            success: true,
            message: `Đã gắn thành công ${result.count} thể loại mới!`
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateMovieGenres = async (req, res) => {
    try {
        await updateMovieGenreService(
            req.params.movieId,
            req.body.genre_ids
        );

        res.json({
            success: true,
            message: 'Cập nhật Thể loại thành công!'
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const assignTopicsToMovie = async (req, res) => {
    try {
        const result = await assignTopicsToMovieService(
            req.params.movieId,
            req.body.topic_ids
        );

        res.json({
            success: true,
            message: `Đã gắn thành công ${result.count} chủ đề mới!`
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateMovieTopics = async (req, res) => {
    try {
        await updateMovieTopicService(
            req.params.movieId,
            req.body.topic_ids
        );

        res.json({
            success: true,
            message: 'Cập nhật Chủ đề thành công!'
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const createSeason = async (req, res) => {
    try {
        const season = await createSeasonService(
            req.params.movieId,
            req.body
        );

        res.json({
            success: true,
            message: 'Thêm Season thành công!',
            data: season
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const createEpisode = async (req, res) => {
    try {
        console.log("1 controller");
        const episode = await createEpisodeService(
            req.params.seasonId,
            req.body
        );
        console.log("2 service");

        res.json({
            success: true,
            message: 'Thêm tập phim thành công!',
            data: episode
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateMovie = async (req, res) => {
    try {
        console.log("update movie controller");
        const updatedMovie = await updateMovieService(
            req.params.id,
            req.body
        );
        console.log("update movie service");
        res.json({
            success: true,
            data: updatedMovie
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
        const updatedEpisode = await updateEpisodeService(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            data: updatedEpisode
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getRandomMovies,
    getMovieById,
    createMovie,
    createSeason,
    createEpisode,
    updateMovie,
    updateEpisode,
    assignGenresToMovie,
    updateMovieGenres,
    assignTopicsToMovie,
    updateMovieTopics
};