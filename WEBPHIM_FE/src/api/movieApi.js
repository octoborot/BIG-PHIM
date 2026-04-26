import axiosClient from './axiosClient';

const movieApi = {
    // Gọi API lấy danh sách phim (có hỗ trợ phân trang, tìm kiếm)
    getAll: (params) => {
        return axiosClient.get('/search/movies', { params });
    },
    // Lấy chi tiết 1 bộ phim
    getById: (id) => {
        const url = `/movies/${id}`;
        return axiosClient.get(url);
    },
    getRandom: () => {
        const url = '/movies/random';
        return axiosClient.get(url);
    },
};

export default movieApi;