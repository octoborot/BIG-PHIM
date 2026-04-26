import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

const AdminDetail = () => {
    const [profile, setProfile] = useState({
        display_name: '',
        gender: '',
        avatar_url: '',
        // SỬA: Dùng role_id khớp với DB
        account: { email: '', role_id: null } 
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Lấy dữ liệu hồ sơ khi vào trang
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await adminApi.getMyProfile();
                if (response.success) {
                    const data = response.data;
                    setProfile({
                        display_name: data.display_name || '', 
                        gender: data.gender || 'Không xác định',
                        avatar_url: (data.avatar_url && data.avatar_url !== 'linkk') ? data.avatar_url : '',
                        // SỬA: Cập nhật biến role_id
                        account: data.account || { email: '', role_id: null },
                        account_id: data.account_id
                    });
                }
            } catch (error) {
                console.error("Lỗi lấy hồ sơ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // 2. Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // 3. Xử lý cập nhật hồ sơ
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const response = await adminApi.updateMyProfile({
                display_name: profile.display_name,
                gender: profile.gender,
                avatar_url: profile.avatar_url
            });

            if (response.success) {
                setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
                setProfile(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error("Lỗi cập nhật hồ sơ:", error);
            setMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại!' });
        } finally {
            setUpdating(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">Đang tải hồ sơ sếp...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Thông tin tài khoản</h1>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* CỘT TRÁI: AVATAR & INFO TỔNG QUAN */}
                <div className="w-full md:w-1/3 bg-gray-900 p-8 flex flex-col items-center text-white">
                    <div className="relative group">
                        <img 
                            src={profile.avatar_url && profile.avatar_url !== 'linkk' ? profile.avatar_url : "https://ui-avatars.com/api/?name=Admin&background=B91C1C&color=fff"} 
                            alt="Avatar" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-red-600 shadow-2xl mb-4"
                        />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-wide">{profile.display_name}</h2>
                    <p className="text-gray-400 text-sm mb-6">{profile.account?.email}</p>
                    
                    <div className="w-full space-y-3 border-t border-gray-700 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Quyền hạn:</span>
                            {/* SỬA: Render bằng logic kiểm tra role_id (giả sử 1 là Admin) */}
                            <span className="text-red-500 font-bold uppercase">
                                {profile.account?.role_id === 1 ? 'Quản trị viên' : 'Người dùng'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">ID Account:</span>
                            <span>#{profile.account_id}</span>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM CHỈNH SỬA */}
                <div className="w-full md:w-2/3 p-8">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Tên hiển thị</label>
                            <input 
                                type="text" name="display_name"
                                value={profile.display_name} onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                                placeholder="Nhập tên sếp..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Giới tính</label>
                            <select 
                                name="gender" value={profile.gender} onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nu">Nữ</option>
                                <option value="Kh_ng_x_c___nh">Không xác định</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Link ảnh Avatar</label>
                            <input 
                                type="text" name="avatar_url"
                                value={profile.avatar_url} onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                placeholder="Dán link ảnh vào đây..."
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button 
                                type="submit" disabled={updating}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                            >
                                {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => window.location.reload()}
                                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition-all"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDetail;