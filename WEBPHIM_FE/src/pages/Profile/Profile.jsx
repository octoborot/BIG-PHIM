import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';
import historyApi from '../../api/historyApi';
import MovieCard from '../../components/movie/MovieCard';
import { toast } from 'react-toastify';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setSubmiting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        display_name: '',
        gender: 'Kh_ng_x_c___nh',
        avatar_url: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, histRes] = await Promise.all([
                    userApi.getMe(),
                    historyApi.getList()
                ]);

                if (userRes.success) setUser(userRes.data);
                if (histRes.success) setHistory(histRes.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin cá nhân:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEditClick = () =>{
        setFormData({
            display_name: user?.display_name || '',
            gender: user?.gender || 'Kh_ng_x_c___nh',
            avatar_url: user?.avatar_url || ''
        });
        setError('');
        setIsEditing(true);
    }

    const handleSave = async () =>{
        if(!formData.display_name.trim()){
            setError('Tên hiển thị không được để trống!');
            return;
        }

        setError('');
        setSubmiting(true);
        try{
            const res = await userApi.updateMe(formData);
            if(res.success){
                setUser({ ...user, ...res.data });
                setIsEditing(false);
            }
            toast.success("Cập nhật thành công!");
        } catch(err){
            setError("Cập nhật thất bại: " + err.message);
        } finally{
            setSubmiting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-500 font-bold">Đang tải dữ liệu...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            {/* 1. THÔNG TIN CÁ NHÂN */}
            <div className="bg-gradient-to-b from-red-900/30 to-gray-950 pt-20 pb-10 px-6 md:px-20 border-b border-gray-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    {/* Khu vực Avatar */}
                    <div className="relative group">
                        <img 
                            src={user?.avatar_url || "https://via.placeholder.com/150"} 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600 object-cover shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                            alt="Avatar"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                        />
                    </div>
                    
                    {/* Khu vực Thông tin */}
                    <div className="text-center md:text-left flex-1 w-full">
                        {!isEditing ? (
                            // ====== CHẾ ĐỘ XEM ======
                            <>
                                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 mb-2">
                                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight truncate">
                                        {user?.display_name}
                                    </h1>
                                    <button 
                                        onClick={handleEditClick}
                                        className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-1.5 rounded-full border border-gray-600 transition shrink-0"
                                    >
                                        ✏️ Sửa hồ sơ
                                    </button>
                                </div>
                                <p className="text-gray-400 font-medium mb-6">{user?.account?.email}</p>
                                
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
                                    <span className="bg-gray-800 px-4 py-1.5 rounded-full text-sm border border-gray-700 shadow-sm">
                                        👤 Giới tính: <span className="text-gray-300">{user?.gender === 'Nam' ? 'Nam' : user?.gender === 'N_' ? 'Nữ' : 'Không xác định'}</span>
                                    </span>
                                    <span className="bg-gray-800 px-4 py-1.5 rounded-full text-sm border border-gray-700 shadow-sm">
                                        📅 Tham gia: <span className="text-gray-300">{user?.created_at ? new Date(user?.created_at).getFullYear() : 'N/A'}</span>
                                    </span>
                                </div>
                            </>
                        ) : (
                            // ====== CHẾ ĐỘ SỬA ======
                            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-2xl text-left w-full">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Chỉnh sửa thông tin</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Tên hiển thị</label>
                                        <input 
                                            type="text" 
                                            value={formData.display_name}
                                            onChange={(e) => {
                                                setFormData({...formData, display_name: e.target.value});
                                                if (error) setError(''); // UX Xịn: Vừa gõ phím là tự mất dòng báo lỗi đỏ
                                            }}
                                            // Đổi màu viền thành Đỏ nếu đang có lỗi
                                            className={`w-full bg-gray-800 text-white border ${error ? 'border-red-500' : 'border-gray-600'} rounded p-2 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors`}
                                        />
                                        {/* Hiện dòng chữ đỏ dưới ô input nếu có lỗi */}
                                        {error && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Link ảnh đại diện (Avatar URL)</label>
                                        <input 
                                            type="text" 
                                            value={formData.avatar_url}
                                            onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                                            placeholder="https://..."
                                            className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Giới tính</label>
                                        {/* Lưu ý: Value ở đây phải khớp 100% với tên biến Enum trong Database */}
                                        <select 
                                            value={formData.gender}
                                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                            className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nu">Nữ</option>
                                            <option value="Kh_ng_x_c___nh">Không xác định</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            onClick={handleSave}
                                            disabled={isSubmitting}
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-bold transition"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. LỊCH SỬ XEM PHIM */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
                <section>
                    <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-7 bg-red-600 rounded-full"></span>
                        Lịch sử xem gần đây
                    </h2>
                    
                        <div className="flex overflow-x-auto space-x-4 pb-6 px-2 -mx-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">                        {history.length > 0 ? history.map((item) => {
                            const movie = item.episode?.season?.movie || item.movie; // Ưu tiên lấy movie từ season trước, nếu không có mới lấy trực tiếp từ episode
                            if (!movie) return null;
                            
                            return (
                                <div key={item.id} className="w-[42vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] xl:w-[240px] flex-none snap-start relative group">
                                    <MovieCard movie={movie} />
                                    
                                    {/* Tag hiển thị đang xem tập mấy */}
                                    {movie?.type === 'Series' && (
                                        <div className="absolute top-2 left-2 z-10 bg-black/80 text-xs font-semibold text-white px-3 py-1 rounded-full border border-gray-700 shadow-lg">
                                            Tập {item.episode?.episode_number}
                                        </div>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="w-full text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800">
                                <p className="text-gray-400">Bạn chưa xem bộ phim nào.</p>
                                <button onClick={() => navigate('/')} className="mt-4 text-red-500 hover:text-red-400 font-medium underline">
                                    Khám phá ngay
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;