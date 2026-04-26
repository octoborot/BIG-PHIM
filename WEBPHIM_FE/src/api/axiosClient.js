import axios from 'axios';

// 1. Khởi tạo trạm thu phát với địa chỉ Backend mặc định
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1.5 REQUEST INTERCEPTOR: Tự động thêm token vào header
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. KẺ CHẶN ĐƯỜNG SAU KHI NHẬN KẾT QUẢ (Response Interceptor)
// Nhiệm vụ: Bóc lớp vỏ response.data ra để frontend dùng trực tiếp, xử lý lỗi 401
axiosClient.interceptors.response.use(
    (response) => {
        // Axios bọc dữ liệu từ API trong response.data
        // Chúng ta bóc lớp vỏ đó ra để code frontend gọn gàng hơn
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Kiểm tra xem error có response từ server không (để tránh crash)
        if (error.response && error.response.status === 401) {
            console.error('❌ Token hết hạn hoặc không hợp lệ! Redirect về login...');
            
            localStorage.clear(); // 👈 thay thế
            window.location.href = '/login'; // 👈 redirect
        }
        return Promise.reject(error);
    }
);

export default axiosClient;