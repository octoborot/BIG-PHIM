import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const AdminMovies = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Dữ liệu Thể loại & Chủ đề tải từ DB
    const [allGenres, setAllGenres] = useState([]);
    const [allTopics, setAllTopics] = useState([]);

    // States cho Modal Sửa Phim (như cũ)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // States cho Modal Gắn Danh Mục (MỚI)
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [taggingMovie, setTaggingMovie] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [isTagging, setIsTagging] = useState(false);

    // Khởi tạo tải dữ liệu Phim và Danh mục
    useEffect(() => {
        fetchMovies(currentPage);
        fetchCategories();
    }, [currentPage]);

    const fetchCategories = async () => {
        try {
            const [gRes, tRes] = await Promise.all([adminApi.getGenres(), adminApi.getTopics()]);
            if (gRes.data || gRes.success) setAllGenres(gRes.data?.data || gRes.data || []);
            if (tRes.data || tRes.success) setAllTopics(tRes.data?.data || tRes.data || []);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    };

    const fetchMovies = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await adminApi.getMovies({ page });
            const responseData = res.data || res;
            if (responseData.success && Array.isArray(responseData.data)) {
                setMovies(responseData.data);
                setTotalPages(responseData.pagination?.totalPages || 1);
            } else if (Array.isArray(responseData)) {
                setMovies(responseData);
            } else if (responseData.data && Array.isArray(responseData.data)) {
                setMovies(responseData.data);
                setTotalPages(responseData.pagination?.totalPages || 1);
            } else setMovies([]);
        } catch (error) {
            console.error("Lỗi tải phim:", error);
            setMovies([]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- HÀM CHO MODAL GẮN DANH MỤC (THỂ LOẠI / CHỦ ĐỀ) ---
    const openTagModal = (movie) => {
        setTaggingMovie(movie);
        
        // Cập nhật: Tự động lấy id bất kể Backend trả về 'genre.id' hay 'genre_id'
        const existingGenres = movie.movie_genre 
            ? movie.movie_genre
                .map(item => item.genre?.id || item.genre_id)
                .filter(id => id !== undefined) 
            : [];

        const existingTopics = movie.movie_topic 
            ? movie.movie_topic
                .map(item => item.topic?.id || item.topic_id)
                .filter(id => id !== undefined)
            : [];

        setSelectedGenres(existingGenres);
        setSelectedTopics(existingTopics);
        
        setIsTagModalOpen(true);
    };

    const handleToggleGenre = (id) => {
        setSelectedGenres(prev => prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]);
    };

    const handleToggleTopic = (id) => {
        setSelectedTopics(prev => prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]);
    };

    const handleSaveTags = async () => {
        setIsTagging(true);
        try {
            // Gọi 2 hàm PUT update (Mảng rỗng [] cũng gửi lên để Backend xóa sạch nếu Admin bỏ chọn hết)
            const requests = [
                adminApi.updateMovieGenres(taggingMovie.id, { genre_ids: selectedGenres }),
                adminApi.updateMovieTopics(taggingMovie.id, { topic_ids: selectedTopics })
            ];

            await Promise.all(requests);
            
            toast.success("Cập nhật danh mục thành công!");
            setIsTagModalOpen(false);
            fetchMovies(currentPage); // Refresh lại bảng để có dữ liệu mới nhất
            
        } catch (error) {
            console.error("Lỗi cập nhật danh mục:", error);
            toast.error("Có lỗi xảy ra khi lưu danh mục!");
        } finally { 
            setIsTagging(false); 
        }
    };

    // --- CÁC HÀM XỬ LÝ SỬA/XÓA CŨ ---
    const handleOpenEditModal = (movie) => { setEditingMovie({ ...movie }); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setIsEditModalOpen(false); setEditingMovie(null); };
    const handleChangeInput = (e) => { const { name, value } = e.target; setEditingMovie(prev => ({ ...prev, [name]: value })); };
    
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToUpdate = { ...editingMovie, age_rating: parseFloat(editingMovie.age_rating) || 0 };
            await adminApi.updateMovie(editingMovie.id, dataToUpdate);
            toast.success("Cập nhật thành công!");
            handleCloseEditModal();
            fetchMovies(currentPage);
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            toast.error("Có lỗi xảy ra khi cập nhật!");
        } finally { setIsSaving(false); }
    };

    // const handleDelete = (id) => { alert("Chức năng xóa sẽ hoàn thiện sau!"); }

    const getStatusUI = (rawStatus) => {
        if (!rawStatus) return { text: "Chưa cập nhật", colorClass: "bg-gray-100 text-gray-700" };
        const cleanStatus = String(rawStatus).trim().toUpperCase();
        switch (cleanStatus) {
            case 'COMPLETED': return { text: "Hoàn thành", colorClass: "bg-green-100 text-green-700" };
            case 'ONGOING': return { text: "Đang chiếu", colorClass: "bg-blue-100 text-blue-700" };
            case 'UPCOMING': return { text: "Sắp chiếu", colorClass: "bg-orange-100 text-orange-700" };
            default: return { text: cleanStatus, colorClass: "bg-gray-100 text-gray-700" };
        }
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingMovie(null);
    };

    const [newMovie, setNewMovie] = useState({
        title: '', orignal_title: '', description: '',
        type: 'Single', // Mặc định là Phim Lẻ
        release_year: '', country: '', poster_url: '', trailer_url: '',
        age_rating: '', status: 'upcoming',
        // 2 biến phụ trợ cho Phim Lẻ
        video_url: '', duration: ''
    });

    const handleAddMovieSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // API 1: TẠO PHIM
            const movieDataToSubmit = {
                ...newMovie,
                age_rating: parseFloat(newMovie.age_rating) || 0
            };
            const movieRes = await adminApi.addMovie(movieDataToSubmit);
            // Lấy ID phim vừa tạo thành công
            const newId = movieRes.data?.data?.id || movieRes.data?.id;

            if (newId) {
                // API 2: TẠO SEASON 1 (Mặc định cho cả Phim Lẻ và Phim Bộ)
                const seasonRes = await adminApi.addSeason(newId, {
                    season_number: 1,
                    title: 'Phần 1',
                    description: 'Phần mặc định'
                });
                const seasonId = seasonRes.data?.data?.id || seasonRes.data?.id;

                // API 3: TẠO TẬP 1 (Chỉ chạy nếu là Phim Lẻ và có nhập Link Video)
                if (seasonId && newMovie.type === 'Single' && newMovie.video_url) {
                    await adminApi.addEpisode(seasonId, {
                        episode_number: 1,
                        title: 'Tập Full',
                        video_url: newMovie.video_url,
                        duration: parseInt(newMovie.duration) || 0
                    });
                }
            }

            toast.success("🎉 Thêm phim mới thành công trọn gói!");
            setIsAddModalOpen(false);
            // Reset lại form cho lần sau
            setNewMovie({
                title: '', orignal_title: '', description: '', type: 'Single', release_year: '', country: '', poster_url: '', trailer_url: '', age_rating: '', status: 'upcoming', video_url: '', duration: ''
            });
            fetchMovies(currentPage); // Tải lại bảng
        } catch (error) {
            console.error("Lỗi thêm phim:", error);
            toast.error("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho Phim</h1>
                    <p className="text-sm text-gray-500 mt-1">Thêm, sửa, xóa và quản lý tất cả phim trên hệ thống.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Thêm phim mới
                </button>
            </div>

            {/* BẢNG HIỂN THỊ PHIM */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Hình ảnh & Tên phim</th>
                                <th className="px-6 py-4 font-semibold">Loại</th>
                                <th className="px-6 py-4 font-semibold">Điểm</th>
                                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
                            ) : movies && movies.length > 0 ? (
                                movies.map((movie) => (
                                    <tr key={movie.id} className="border-b border-gray-100 hover:bg-gray-50"> 
                                        <td className="px-6 py-4 text-gray-600">#{movie.id}</td>
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            {movie.poster_url ? (
                                                <img src={movie.poster_url} alt={movie.title} className="w-12 h-16 object-cover rounded shadow-sm"/>
                                            ) : (
                                                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 text-center px-1">Không có ảnh</div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-800">{movie.title}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{movie.orignal_title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium border border-blue-100">{movie.type}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-yellow-600">
                                            ⭐ {movie.age_rating ? Number(movie.age_rating).toFixed(1) : '0.0'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusUI(movie.status).colorClass}`}>
                                                {getStatusUI(movie.status).text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            {/* NÚT GẮN DANH MỤC */}
                                            <button 
                                                onClick={() => openTagModal(movie)} 
                                                title="Gắn danh mục"
                                                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleOpenEditModal(movie)} 
                                                title="Sửa phim"
                                                className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.113l-3.122.78a.75.75 0 01-.933-.933l.78-3.122a4.5 4.5 0 011.113-1.89l13.15-13.15z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
                                                </svg>
                                            </button>
                                            {/* <button 
                                                title="Xóa phim"
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-500">Chưa có phim nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4 px-2">
                        <span className="text-sm text-gray-600">
                            Trang <span className="font-bold">{currentPage}</span> / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(p => p - 1)} 
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
                            >
                                Trước
                            </button>
                            <button 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage(p => p + 1)} 
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================== */}
            {/* MODAL GẮN THỂ LOẠI & CHỦ ĐỀ (MULTI-CHECKBOX) */}
            {/* ============================================== */}
            {isTagModalOpen && taggingMovie && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Gắn danh mục cho phim</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium text-blue-600">{taggingMovie.title}</p>
                        </div>
                        
                        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cột Thể Loại */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Chọn Thể loại (Genres)</h3>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {allGenres.length > 0 ? allGenres.map(genre => (
                                        <label key={genre.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200 transition">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                checked={selectedGenres.includes(genre.id)}
                                                onChange={() => handleToggleGenre(genre.id)}
                                            />
                                            <span className="text-gray-700 text-sm">{genre.name}</span>
                                        </label>
                                    )) : <span className="text-sm text-gray-500">Chưa có dữ liệu thể loại</span>}
                                </div>
                            </div>

                            {/* Cột Chủ Đề */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Chọn Chủ đề (Topics)</h3>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {allTopics.length > 0 ? allTopics.map(topic => (
                                        <label key={topic.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200 transition">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                checked={selectedTopics.includes(topic.id)}
                                                onChange={() => handleToggleTopic(topic.id)}
                                            />
                                            <span className="text-gray-700 text-sm">{topic.name}</span>
                                        </label>
                                    )) : <span className="text-sm text-gray-500">Chưa có dữ liệu chủ đề</span>}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                            <button onClick={() => setIsTagModalOpen(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 rounded font-medium transition">
                                Hủy
                            </button>
                            <button onClick={handleSaveTags} disabled={isTagging} className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded font-medium transition disabled:opacity-50">
                                {isTagging ? 'Đang gắn...' : 'Lưu danh mục'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SỬA PHIM (Giữ nguyên như cũ) */}
            {isEditModalOpen && editingMovie && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sửa thông tin phim</h2>
                        
                        <form onSubmit={handleSaveChanges} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Tên phim */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên phim</label>
                                    <input type="text" name="title" value={editingMovie.title || ''} onChange={handleChangeInput} required className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                
                                {/* Tên gốc */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên gốc (Original)</label>
                                    <input type="text" name="orignal_title" value={editingMovie.orignal_title || ''} onChange={handleChangeInput} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>

                                {/* Link Ảnh */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh Poster</label>
                                    <input type="text" name="poster_url" value={editingMovie.poster_url || ''} onChange={handleChangeInput} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>

                                {/* Quốc gia */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                                    <input type="text" name="country" value={editingMovie.country || ''} onChange={handleChangeInput} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>

                                {/* Loại phim */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại (Type)</label>
                                    <select name="type" value={editingMovie.type || ''} onChange={handleChangeInput} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500">
                                        <option value="MOVIE">Phim Lẻ (MOVIE)</option>
                                        <option value="SERIES">Phim Bộ (SERIES)</option>
                                    </select>
                                </div>

                                {/* Ngày phát hành */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày phát hành</label>
                                    <input type="date" name="release_year" value={formatDateForInput(editingMovie.release_year)} onChange={handleChangeInput} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>

                                {/* Trạng thái */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                    <select name="status" value={editingMovie.status} onChange={handleChangeInput} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500">
                                        <option value="ongoing">Đã xuất bản</option>
                                        <option value="completed">Hoàn thành</option>
                                        <option value="upcoming">Sắp ra mắt</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded font-medium transition">
                                    Hủy
                                </button>
                                <button type="submit" disabled={isSaving} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium transition disabled:opacity-50">
                                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL THÊM PHIM MỚI */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 hide-scrollbar">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-gray-800">Thêm phim mới</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddMovieSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CỘT 1 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên phim (Tiếng Việt) *</label>
                                        <input required type="text" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Biệt Đội Đánh Thuê" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên gốc (Original)</label>
                                        <input type="text" value={newMovie.orignal_title} onChange={e => setNewMovie({...newMovie, orignal_title: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: The Expendables" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Loại Phim</label>
                                            <select value={newMovie.type} onChange={e => setNewMovie({...newMovie, type: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none">
                                                <option value="Single">Phim Lẻ</option>
                                                <option value="Series">Phim Bộ</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Quốc gia</label>
                                            <input type="text" value={newMovie.country} onChange={e => setNewMovie({...newMovie, country: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Mỹ" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày phát hành *</label>
                                            <input required type="date" value={newMovie.release_year} onChange={e => setNewMovie({...newMovie, release_year: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Điểm (VD: 8.5)</label>
                                            <input type="number" step="0.1" value={newMovie.age_rating} onChange={e => setNewMovie({...newMovie, age_rating: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* CỘT 2 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">URL Poster Ảnh bìa *</label>
                                        <input required type="text" value={newMovie.poster_url} onChange={e => setNewMovie({...newMovie, poster_url: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">URL Trailer (Youtube Embed)</label>
                                        <input type="text" value={newMovie.trailer_url} onChange={e => setNewMovie({...newMovie, trailer_url: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://www.youtube.com/embed/..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả nội dung phim</label>
                                        <textarea rows="4" value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Nhập nội dung tóm tắt..."></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* HIỆN KHU VỰC NHẬP LINK VIDEO NẾU LÀ PHIM LẺ */}
                            {newMovie.type === 'Single' && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        Dữ liệu Tập phim (Tự động tạo Season 1 & Tập 1)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-blue-900 mb-1">URL Link Video chính *</label>
                                            <input required={newMovie.type === 'Single'} type="text" value={newMovie.video_url} onChange={e => setNewMovie({...newMovie, video_url: e.target.value})} className="w-full border-blue-200 rounded-lg p-2.5 outline-none" placeholder="Link m3u8 hoặc mp4..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Thời lượng (Phút)</label>
                                            <input type="number" value={newMovie.duration} onChange={e => setNewMovie({...newMovie, duration: e.target.value})} className="w-full border-blue-200 rounded-lg p-2.5 outline-none" placeholder="VD: 120" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái khởi tạo</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="status" value="upcoming" checked={newMovie.status === 'upcoming'} onChange={e => setNewMovie({...newMovie, status: e.target.value})} className="w-4 h-4 text-blue-600" /> Sắp chiếu</label>
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="status" value="ongoing" checked={newMovie.status === 'ongoing'} onChange={e => setNewMovie({...newMovie, status: e.target.value})} className="w-4 h-4 text-blue-600" /> Đang chiếu</label>
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="status" value="completed" checked={newMovie.status === 'completed'} onChange={e => setNewMovie({...newMovie, status: e.target.value})} className="w-4 h-4 text-blue-600" /> Hoàn thành</label>
                                </div>
                            </div>

                            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Hủy</button>
                                <button type="submit" disabled={isSaving} className="px-8 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2">
                                    {isSaving ? 'Đang xử lý...' : 'Xác nhận & Lưu phim'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMovies;