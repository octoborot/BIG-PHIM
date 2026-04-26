import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi'; // Đảm bảo đúng đường dẫn

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        lockedUsers: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Gọi song song cả 2 API cho nhanh
                const [statRes, userRes] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getRecentUsers()
                ]);

                if (statRes.success) setStats(statRes.data);
                if (userRes.success) setRecentUsers(userRes.data);
            } catch (error) {
                console.error("Lỗi Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold">Đang tải dữ liệu thật...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Bảng điều khiển Admin</h1>

            {/* Các thẻ thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Tổng Người Dùng" value={stats.totalUsers} icon="👥" color="blue" />
                <StatCard title="Tổng Số Phim" value={stats.totalMovies} icon="🎬" color="purple" />
                <StatCard title="Tài khoản bị khóa" value={stats.lockedUsers} icon="🔒" color="red" />
            </div>

            {/* Bảng người dùng mới nhất */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">5 Người dùng mới nhất</h2>
                </div>
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Tên hiển thị</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Ngày đăng ký</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {recentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{user.profile?.display_name || 'N/A'}</td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Component con cho thẻ thống kê (để code gọn hơn)
const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500 flex items-center justify-between`}>
        <div>
            <p className="text-gray-500 text-xs font-semibold uppercase">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-full text-xl`}>{icon}</div>
    </div>
);

export default Dashboard;