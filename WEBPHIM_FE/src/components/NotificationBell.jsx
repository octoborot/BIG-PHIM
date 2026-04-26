import React, { useState, useEffect, useRef } from 'react';
import notificationApi from '../api/notificationApi'; // Sửa lại đường dẫn nếu cần

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // Dùng state riêng để chứa số đếm từ Backend
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await notificationApi.getList();
                if (res.success) {
                    // Lấy chính xác dữ liệu từ cục response API xịn của bạn
                    setNotifications(res.data);
                    setUnreadCount(res.unread_count); 
                }
            } catch (error) {
                console.error("Lỗi tải thông báo:", error);
            }
        };

        fetchNotifications();

        // Xử lý tự động đóng menu khi click ra ngoài
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Xử lý khi click vào 1 thông báo
    const handleNotificationClick = async (noti) => {
        if (noti.is_read) return; // Đã đọc rồi thì bỏ qua

        try {
            const res = await notificationApi.markAsRead(noti.id);
            
            if (res.success) {
                // 1. Đổi màu thông báo đó thành "Đã đọc"
                setNotifications(prev => prev.map(n => 
                    n.id === noti.id ? { ...n, is_read: true } : n
                ));
                
                // 2. Trừ đi 1 ở cái chấm đỏ (dùng Math.max để tránh số âm)
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu đọc:", error);
        }
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { hour: '2-digit', minute:'2-digit' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* ================= NÚT CÁI CHUÔNG ================= */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition rounded-full hover:bg-gray-800 focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* CHẤM ĐỎ (Chỉ hiện khi unreadCount > 0) */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* ================= DANH SÁCH XỔ XUỐNG ================= */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                        <h3 className="text-white font-bold text-lg">Thông báo</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs text-red-500 font-medium bg-red-500/10 px-2 py-1 rounded">
                                {unreadCount} chưa đọc
                            </span>
                        )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                Bạn không có thông báo nào.
                            </div>
                        ) : (
                            notifications.map(noti => (
                                <div 
                                    key={noti.id}
                                    onClick={() => handleNotificationClick(noti)}
                                    className={`p-4 border-b border-gray-800/50 cursor-pointer transition hover:bg-gray-700 ${noti.is_read ? 'opacity-60 bg-gray-900' : 'bg-gray-800'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1.5 shrink-0">
                                            {!noti.is_read ? (
                                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                            ) : (
                                                <div className="w-2.5 h-2.5"></div> 
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm ${noti.is_read ? 'text-gray-400' : 'text-white font-medium'}`}>
                                                {noti.content}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1.5 font-mono">
                                                {formatDate(noti.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;