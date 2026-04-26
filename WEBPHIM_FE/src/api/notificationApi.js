import axiosClient from './axiosClient';

const notificationApi = {
    // Gọi API lấy danh sách (sẽ trả về cả data và unread_count)
    getList: () => axiosClient.get('/notifications'),
    
    // Gọi API đánh dấu đã đọc
    markAsRead: (id) => axiosClient.put(`/notifications/${id}/read`),
};

export default notificationApi;