const { searchMoviesService } = require('../services/search.service');

const searchMovies = async (req, res) => {
    try {
        const result = await searchMoviesService(req.query);

        res.json({
            success: true,
            data: result.movies,
            pagination: result.pagination
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách/lọc phim:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    searchMovies
};