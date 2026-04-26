import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import { useAuth } from '../../context/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Sử dụng react-hook-form để quản lý ô input và validate
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setServerError(''); 
        setIsLoading(true); 

        try {
            const response = await authApi.login(data);
            
            // 🛑 BƯỚC 1: IN RA ĐỂ XEM HÌNH THÙ DỮ LIỆU THỰC TẾ
            console.log("Toàn bộ Response từ API:", response);

            // 🛑 BƯỚC 2: KIỂM TRA ĐIỀU KIỆN
            // axiosClient đã bóc lớp vỏ, nên response là dữ liệu thô từ Backend
            // Backend trả về: { success, message, token, data }
            const token = response.token;

            if (response.success && token) {
                const userInfo = response.data || {};

                const roleName = userInfo.role || '';

                login(token, {
                    id: userInfo.id,
                    role: roleName
                });

                console.log("✅ Role:", roleName);

                if (roleName.toUpperCase() === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                console.error("❌ Đăng nhập OK nhưng thiếu success hoặc token. Check lại backend!");
                setServerError("Lỗi cấu trúc dữ liệu từ máy chủ.");
            }
        } catch (error) {
            console.error('❌ Lỗi login:', error);
            setServerError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Bắt đầu màn phép thuật Responsive của Tailwind
        // Mặc định: Mobile (w-full, p-4)
        // md: iPad (w-3/4, p-8)
        // lg: Laptop (w-1/3)
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 w-full md:w-3/4 lg:w-1/3 p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700">
                
                {/* Logo & Tiêu đề */}
                <div className="text-center md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 tracking-wider mb-2">
                        BIG PHIM
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Đăng nhập để xem những bộ phim hấp dẫn!
                    </p>
                    
                </div>

                {/* Form Đăng nhập */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
                    
                    {/* Ô Email */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">Email</label>
                        <input 
                            type="email"
                            placeholder="nguyenvana123@gmail.com"
                            className={`w-full p-3 md:p-3.5 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150
                                ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                            {...register("email", { 
                                required: "Vui lòng nhập Email", 
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Email không đúng định dạng"
                                }
                            })}
                        />
                        {/* Hiển thị lỗi validate */}
                        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                    </div>

                    {/* Ô Mật khẩu */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">Mật khẩu</label>
                        <input 
                            type="password"
                            placeholder="••••••"
                            className={`w-full p-3 md:p-3.5 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150
                                ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                            {...register("password", { 
                                required: "Vui lòng nhập mật khẩu", 
                                minLength: {
                                    value: 6,
                                    message: "Mật khẩu phải có ít nhất 6 ký tự"
                                }
                            })}
                        />
                        {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
                    </div>

                    {/* Hiển thị lỗi từ Server (ví dụ: Sai mật khẩu) */}
                    {serverError && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-sm text-center">
                            {serverError}
                        </div>
                    )}

                    {/* Nút Đăng nhập */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3.5 md:p-4 rounded-lg text-lg transition duration-150 shadow-md transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Link Đăng ký */}
                <div className="text-center mt-8 text-sm md:text-base text-gray-400">
                    Chưa có tài khoản?{' '}
                    <button 
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-red-500 hover:text-red-400 font-medium transition duration-150"
                    >
                        Đăng ký ngay
                    </button>
                </div>

                <button
    onClick={() => navigate('/')}
    className="
        fixed top-5 left-5 z-50 
        flex items-center gap-2
        px-4 py-2 
        bg-red-600/80 
        backdrop-blur-md 
        text-white 
        rounded-full 

        shadow-lg shadow-red-900/50
        hover:shadow-red-500/70

        hover:bg-red-500 
        hover:scale-105 
        active:scale-95

        transition-all duration-300
    "
>
    ⬅ Trang chủ
</button>

                
            </div>
        </div>
    );
};

export default Login;