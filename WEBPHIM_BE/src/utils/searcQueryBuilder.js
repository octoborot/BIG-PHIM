const buildMovieWhere = (query) => {
    const { search, genre_id, topic_id, country } = query;

    const where = {};

    if (search) {
        where.title = {
            contains: search,
            mode: 'insensitive'
        };
    }

    if (country) {
        where.country = country;
    }

    if (genre_id) {
        const genreIds = String(genre_id)
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        if (genreIds.length > 0) {
            where.movie_genre = {
                some: {
                    genre_id: { in: genreIds }
                }
            };
        }
    }

    if (topic_id) {
        const topicId = parseInt(topic_id);
        if (!isNaN(topicId)) {
            where.movie_topic = {
                some: {
                    topic_id: topicId
                }
            };
        }
    }

    return where;
};

module.exports = {
    buildMovieWhere
};