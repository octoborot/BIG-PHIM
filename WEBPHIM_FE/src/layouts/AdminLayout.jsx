import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hàm kiểm tra menu nào đang active để đổi màu
    const isActive = (path) => location.pathname.includes(path);

    const handleLogout = () => {
        // 1. Dọn dẹp sạch sẽ dữ liệu cá nhân trong LocalStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');

        // Mẹo: Nếu app của bạn không lưu setting gì quan trọng khác, 
        // bạn có thể dùng lệnh này để xóa sổ toàn bộ (ngắn gọn hơn):
        // localStorage.clear();

        // 2. Chuyển hướng người dùng về thẳng trang Đăng nhập
        navigate('/login', { replace: true }); 
        // Dùng { replace: true } để họ không thể bấm nút "Back" trên trình duyệt để quay lại trang Admin được nữa
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* ================= SIDEBAR (CỘT MENU TRÁI) ================= */}
            <div className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-red-600 tracking-wider">BIG PHIM</h1>
                    <p className="text-sm text-gray-400 mt-1">Bảng quản trị hệ thống</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link 
                        to="/admin/dashboard" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <span>📊</span> Tổng quan
                    </Link>
                    <Link 
                        to="/admin/movies" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/movies') ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <span>🎬</span> Quản lý Phim
                    </Link>
                    <Link 
                        to="/admin/seaepi" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/seaepi') ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <span>📺</span> Season & Episode
                    </Link>
                    <Link 
                        to="/admin/gentop" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/gentop') ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <span>🏷️</span> Thể loại & Chủ đề
                    </Link>
                    <Link 
                        to="/admin/users" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <span>👥</span> Người dùng
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout} // <--- GẮN HÀM VÀO ĐÂY
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-600 text-white py-2 rounded-lg transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>

            {/* ================= KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) ================= */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header nhỏ phía trên */}
                {/* Header nhỏ phía trên */}
                <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {/* Hiển thị tiêu đề tùy theo route */}
                        {location.pathname === '/admin/movies' ? 'Quản lý kho phim' : 'Bảng điều khiển'}
                    </h2>
                    
                    {/* BIẾN KHU VỰC NÀY THÀNH THẺ LINK CÓ HIỆU ỨNG HOVER */}
                    <Link 
                        to="/admin/detail" 
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
                    >
                        <img 
                            src="https://ui-avatars.com/api/?name=Admin&background=B91C1C&color=fff" 
                            alt="Admin" 
                            className="w-9 h-9 rounded-full shadow-sm" 
                        />
                        <span className="text-sm font-medium text-gray-700">Xin chào, Sếp!</span>
                    </Link>
                </header>

                {/* Nội dung thay đổi theo Route sẽ hiển thị ở đây (thông qua Outlet) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default AdminLayout;