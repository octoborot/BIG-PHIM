import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import { toast } from 'react-toastify';

const Register = ({ onSwitchToLogin }) => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dùng watch để theo dõi ô mật khẩu, phục vụ cho việc so sánh ô "Nhập lại mật khẩu"
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("password", ""); // Theo dõi giá trị ô password

    const onSubmit = async (data) => {
        setServerError('');
        setIsLoading(true);

        try {
            // Gọi API Đăng ký (đã tạo sẵn trong authApi.js hôm trước)
            const response = await authApi.register({
                email: data.email,
                password: data.password,
                display_name: data.displayName
            });

            if (response.success) {
                toast.success('🎉 Đăng ký thành công! Chuyển sang trang Đăng nhập...');
                // Gọi hàm để quay về form Login
                if (onSwitchToLogin) onSwitchToLogin();
            }
        } catch (error) {
            setServerError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 w-full md:w-3/4 lg:w-1/3 p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white mb-2">Tạo Tài Khoản</h2>
                    <p className="text-gray-400 text-sm">Gia nhập Local Netflix ngay hôm nay</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Ô Tên hiển thị */}
                    <div>
                        <input 
                            type="text"
                            placeholder="Tên hiển thị (VD: Trùm Cày Phim)"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            {...register("displayName", { required: "Vui lòng nhập tên của bạn" })}
                        />
                        {errors.displayName && <span className="text-red-500 text-xs mt-1 block">{errors.displayName.message}</span>}
                    </div>

                    {/* Ô Email */}
                    <div>
                        <input 
                            type="email"
                            placeholder="Email của bạn"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            {...register("email", { 
                                required: "Vui lòng nhập Email",
                                pattern: { value: /^\S+@\S+$/i, message: "Email không đúng định dạng" }
                            })}
                        />
                        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                    </div>

                    {/* Ô Mật khẩu */}
                    <div>
                        <input 
                            type="password"
                            placeholder="Mật khẩu (Ít nhất 6 ký tự)"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            {...register("password", { 
                                required: "Vui lòng nhập mật khẩu",
                                minLength: { value: 6, message: "Mật khẩu phải từ 6 ký tự trở lên" }
                            })}
                        />
                        {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
                    </div>

                    {/* Ô Nhập lại Mật khẩu */}
                    <div>
                        <input 
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            {...register("confirmPassword", { 
                                validate: value => value === password || "Mật khẩu không khớp!"
                            })}
                        />
                        {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                    </div>

                    {serverError && <div className="text-red-400 text-sm text-center">{serverError}</div>}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3.5 rounded-lg transition duration-150 disabled:opacity-70"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-400">
                    Đã có tài khoản?{' '}
                    <button 
                        onClick={() => navigate('/login')} 
                        className="text-red-500 hover:text-red-400 font-medium transition duration-150"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;