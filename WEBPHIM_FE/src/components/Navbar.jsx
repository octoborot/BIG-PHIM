import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { useRequireLogin } from '../hooks/useRequireLogin';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const requireLogin = useRequireLogin();
    const { token, logout } = useAuth();

    const handleLogout = () => {
            logout();
            navigate('/login');
    };  

    const activeStyle = "text-white border-b-2 border-red-600 pb-1 font-bold";
    const normalStyle = "text-gray-400 hover:text-white transition-all duration-200 pb-1";

    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-[100] shadow-2xl">
            
            {/* HÀNG 1 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
                
                {/* LOGO */}
                <h1 
                    onClick={() => navigate('/')} 
                    className="text-2xl md:text-3xl font-black text-red-600 tracking-tighter cursor-pointer hover:scale-105 transition-transform shrink-0"
                >
                    BIG PHIM
                </h1>

                {/* BUTTONS */}
                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    
                    <NotificationBell />

                    {/* 👉 PROFILE (có check login) */}
                    <button 
                        onClick={() => requireLogin(() => navigate('/profile'))}
                        className="text-gray-300 hover:text-white p-1" 
                        title="Hồ sơ"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="text-xs md:text-sm bg-red-600 text-gray-200 px-3 py-1.5 rounded hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        {token ? 'Đăng xuất' : 'Đăng nhập'}
                    </button>
                </div>
            </div>

            {/* HÀNG 2 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
                <div className="flex gap-8 text-sm md:text-base uppercase tracking-widest">

                    <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
                        Trang Chủ
                    </NavLink>

                    {/* 👉 MY LIST (có check login) */}
                    <NavLink
                        to="/my-list"
                        onClick={(e) => {
                            e.preventDefault();
                            requireLogin(() => navigate('/my-list'));
                        }}
                        className={({ isActive }) => isActive ? activeStyle : normalStyle}
                    >
                        Phim yêu thích
                    </NavLink>

                    <NavLink to="/filter" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
                        Lọc Phim
                    </NavLink>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;