import axiosClient from './axiosClient';

const userApi = {
    getMe: () => axiosClient.get('/profiles/me'),

    updateMe: (data) => axiosClient.put('/profiles/me', data),
};

export default userApi;