import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Modal nhập lý do khóa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [lockReason, setLockReason] = useState('');

    // Hàm gọi API lấy danh sách user
    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Gọi thẳng từ adminApi cực kỳ gọn gàng
            const response = await adminApi.getUsers(); 
            if (response.success) { // Tuỳ thuộc axiosClient của bạn có tự động bóc tách .data hay chưa
                setUsers(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách user:", error);
            toast.error("Không thể tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm xử lý khi bấm nút Khóa / Mở khóa
    const handleToggleLock = async (user) => {
        if (user.account?.role_id === 1) {
            toast.error("⛔ Không thể khóa Admin!");
            return;
        }

        if (!user.account?.is_locked) {
            setSelectedUser(user);
            setIsModalOpen(true);
            setLockReason('');
        } else {
            if (window.confirm(`Mở khóa cho ${user.account?.email}?`)) {
                await executeLockToggle(user.account_id, false, null);
            }
        }
    };

    // Hàm thực thi gọi API Khóa/Mở khóa
    const executeLockToggle = async (accountId, isLocked, reason) => {
        try {
            const response = await adminApi.toggleUserLock(accountId, { 
                is_locked: isLocked, 
                lock_reason: reason 
            });

            if (response.success) {
                toast.success(isLocked ? "Đã khóa tài khoản!" : "Đã mở khóa tài khoản!");
                setIsModalOpen(false);
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    const submitLock = () => {
        const isLocked = selectedUser?.account?.is_locked;

        if (!isLocked && !lockReason.trim()) {
            toast.error("Vui lòng nhập lý do khóa!");
            return;
        }

        executeLockToggle(
            selectedUser.account_id,
            !isLocked,
            isLocked ? null : lockReason
        );
    };

    if (loading) return <div className="p-10 text-center text-xl font-bold">Đang tải dữ liệu...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Người Dùng</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-100 uppercase tracking-wider border-b-2 border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Thông tin</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Quyền</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Trạng thái</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">#{user.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={user.avatar_url || 'https://via.placeholder.com/40'} 
                                            alt="Avatar" 
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.display_name || 'Chưa cập nhật'}</p>
                                            <p className="text-gray-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.account.role_id === 1 ? (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-medium">Admin</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">User</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {user.account.is_locked ? (
                                        <div className="flex flex-col">
                                            <span className="text-red-600 font-bold">Đã bị khóa</span>
                                        </div>
                                    ) : (
                                        <span className="text-green-600 font-bold">Hoạt động</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {user.account?.role_id !== 1 ? (
                                        <button 
                                            onClick={() => handleToggleLock(user)}
                                            className={`px-4 py-2 rounded-md font-semibold text-white transition-colors shadow-sm ${
                                                user.account?.is_locked 
                                                    ? 'bg-green-500 hover:bg-green-600' 
                                                    : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                        >
                                            {user.account?.is_locked ? 'Mở Khóa' : 'Khóa Tài Khoản'}
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">Quản trị viên</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Không có dữ liệu người dùng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Nhập lý do khóa */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold text-red-600 mb-4">
                            {selectedUser?.account?.is_locked 
                                ? `Mở khóa tài khoản: ${selectedUser?.account?.email}`
                                : `Khóa tài khoản: ${selectedUser?.account?.email}`
                            }
                        </h2>
                        {!selectedUser?.account?.is_locked && (
                            <input
                                type="text"
                                placeholder="Nhập lý do khóa..."
                                value={lockReason}
                                onChange={(e) => setLockReason(e.target.value)}
                                className="w-full p-2 border rounded mb-4"
                            />
                        )}
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={submitLock}
                                className={`px-4 py-2 text-white rounded-md font-medium shadow-md ${
                                    selectedUser?.account?.is_locked
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {selectedUser?.account?.is_locked ? 'Xác nhận Mở khóa' : 'Xác nhận Khóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;