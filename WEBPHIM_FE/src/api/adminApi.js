import axiosClient from './axiosClient';

const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const adminApi = {
    getMovies: (params) => axiosClient.get('/search/movies', { params }),

    addMovie: (data) => axiosClient.post('/movies', data, getAuthConfig()),

    updateMovie: (id, data) => axiosClient.put(`/movies/${id}`, data, getAuthConfig()),
    updateMovieGenres: (movieId, data) => axiosClient.put(`/movies/${movieId}/genres`, data, getAuthConfig()),
    updateMovieTopics: (movieId, data) => axiosClient.put(`/movies/${movieId}/topics`, data, getAuthConfig()),
    
    // Thêm Season cho phim
    addSeason: (movieId, data) => axiosClient.post(`/movies/${movieId}/seasons`, data, getAuthConfig()),
    
    // Thêm Episode (Tập) cho Season
    addEpisode: (seasonId, data) => axiosClient.post(`movies/seasons/${seasonId}/episodes`, data, getAuthConfig()),

    getGenres: () => axiosClient.get('/genres'),
    addGenre: (data) => axiosClient.post('/genres', data, getAuthConfig()),
    updateGenre: (id, data) => axiosClient.put(`/genres/${id}`, data, getAuthConfig()),
    deleteGenre: (id) => axiosClient.delete(`/genres/${id}`, getAuthConfig()),

    getTopics: () => axiosClient.get('/topics'),
    addTopic: (data) => axiosClient.post('/topics', data, getAuthConfig()),
    updateTopic: (id, data) => axiosClient.put(`/topics/${id}`, data, getAuthConfig()),
    deleteTopic: (id) => axiosClient.delete(`/topics/${id}`, getAuthConfig()),

    // --- API CHO SEASON ---
    getSeasonsByMovie: (movieId) => axiosClient.get(`/seasons/movie/${movieId}`),
    updateSeason: (id, data) => axiosClient.put(`/seasons/${id}`, data, getAuthConfig()),
    deleteSeason: (id) => axiosClient.delete(`/seasons/${id}`, getAuthConfig()),

    // --- API CHO EPISODE ---
    getEpisodesBySeason: (seasonId) => axiosClient.get(`/episodes/season/${seasonId}`),
    updateEpisode: (id, data) => axiosClient.put(`/episodes/${id}`, data, getAuthConfig()),
    deleteEpisode: (id) => axiosClient.delete(`/episodes/${id}`, getAuthConfig()),

    getUsers: () => axiosClient.get('/profiles', getAuthConfig()),
    toggleUserLock: (id, data) => axiosClient.patch(`/admin/${id}/lock`, data, getAuthConfig()),

    getStats: () => axiosClient.get('/admin/stats', getAuthConfig()),
    getRecentUsers: () => axiosClient.get('/admin/recent-users', getAuthConfig()),
    getMyProfile: () => axiosClient.get('/profiles/me', getAuthConfig()),
    updateMyProfile: (data) => axiosClient.put('/profiles/me', data, getAuthConfig()),
};

export default adminApi;