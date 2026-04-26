import axiosClient from './axiosClient';

const favoriteApi = {
    // Gọi Backend để thêm vào danh sách
    add: (data) => axiosClient.post('/users/favorites', data),
    
    remove: (movieId) => axiosClient.delete(`/users/favorites/${movieId}`),

    getMyList: () => axiosClient.get('/users/favorites'),

    getMovieDetail: (movieId) => axiosClient.get(`/movies/${movieId}`),
};

export default favoriteApi;