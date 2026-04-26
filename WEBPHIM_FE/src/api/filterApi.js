import axiosClient from './axiosClient';

const filterApi = {
    getFilter: (params) => axiosClient.get('/search/movies', { params: params }),
    getGenre: () => axiosClient.get('/genres'), 
    getTopics: () => axiosClient.get('/topics') 
}

export default filterApi;