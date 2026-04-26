import axiosClient from './axiosClient';

const historyApi = {
    // Gọi API lưu lịch sử (đưa dữ liệu vào)
    save: (data) => axiosClient.post('/users/history', data),
    
    // Gọi API lấy lịch sử (dùng cho tính năng Tiếp tục xem sau này)
    getList: () => axiosClient.get('/users/history'),
};

export default historyApi;