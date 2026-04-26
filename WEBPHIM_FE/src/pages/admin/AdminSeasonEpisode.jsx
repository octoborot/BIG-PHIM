import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const AdminSeasonEpisode = () => {
    // --- STATES ---
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');
    
    const [seasons, setSeasons] = useState([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState('');
    
    const [episodes, setEpisodes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // States cho Modal Season
    const [seasonModal, setSeasonModal] = useState({ isOpen: false, type: 'add', data: null });
    // States cho Modal Episode
    const [episodeModal, setEpisodeModal] = useState({ isOpen: false, type: 'add', data: null });

    // --- 1. TẢI DANH SÁCH PHIM LÚC ĐẦU ---
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Lấy danh sách phim (nên lọc ra phim bộ nếu API hỗ trợ, ở đây lấy hết limit 1000 cho lẹ)
                const res = await adminApi.getMovies({ limit: 1000 });
                const data = res.data?.data || res.data || [];
                // Ưu tiên hiển thị phim bộ (Series) lên đầu
                const sortedMovies = [...data].sort((a, b) => {
                    if (a.type === b.type) return 0;
                    return a.type === 'Series' ? -1 : 1;
                });
                setMovies(sortedMovies);
            } catch (error) {
                console.error("Lỗi tải phim:", error);
            }
        };
        fetchMovies();
    }, []);

    // --- 2. THEO DÕI KHI CHỌN PHIM -> TẢI SEASON ---
    useEffect(() => {
        if (selectedMovieId) {
            fetchSeasons(selectedMovieId);
            setSelectedSeasonId(''); // Reset season
            setEpisodes([]); // Reset episode
        } else {
            setSeasons([]);
        }
    }, [selectedMovieId]);

    const fetchSeasons = async (movieId) => {
        setIsLoading(true);
        try {
            const res = await adminApi.getSeasonsByMovie(movieId);
            const data = res.data?.data || res.data || [];
            // Sắp xếp theo số phần (Season number)
            setSeasons([...data].sort((a, b) => a.season_number - b.season_number));
        } catch (error) {
            console.error("Lỗi tải Season:", error);
            setSeasons([]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- 3. THEO DÕI KHI CHỌN SEASON -> TẢI EPISODE ---
    useEffect(() => {
        if (selectedSeasonId) {
            fetchEpisodes(selectedSeasonId);
        } else {
            setEpisodes([]);
        }
    }, [selectedSeasonId]);

    const fetchEpisodes = async (seasonId) => {
        setIsLoading(true);
        try {
            const res = await adminApi.getEpisodesBySeason(seasonId);
            const data = res.data?.data || res.data || [];
            // Sắp xếp theo số tập (Episode number)
            setEpisodes([...data].sort((a, b) => a.episode_number - b.episode_number));
        } catch (error) {
            console.error("Lỗi tải Episode:", error);
            setEpisodes([]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- 4. HÀM LƯU SEASON ---
    const handleSaveSeason = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                season_number: parseInt(seasonModal.data.season_number),
                title: seasonModal.data.title,
                description: seasonModal.data.description
            };

            if (seasonModal.type === 'add') {
                await adminApi.addSeason(selectedMovieId, payload);
                toast.success("Thêm Phần (Season) thành công!");
            } else {
                await adminApi.updateSeason(seasonModal.data.id, payload);
                toast.success("Cập nhật Phần thành công!");
            }
            setSeasonModal({ isOpen: false, type: 'add', data: null });
            fetchSeasons(selectedMovieId);
        } catch (error) {
            toast.error("Lỗi khi lưu Season!");
            console.error(error);
        }
    };

    const handleDeleteSeason = async (id) => {
        if (!window.confirm("Xóa Phần này sẽ xóa toàn bộ các Tập bên trong. Bạn chắc chứ?")) return;
        try {
            await adminApi.deleteSeason(id);
            toast.success("Đã xóa!");
            fetchSeasons(selectedMovieId);
            if (selectedSeasonId === id) setSelectedSeasonId('');
        } catch (error) {
            console.error("Lỗi chi tiết:", error);
            toast.error("Lỗi khi xóa!");
        }
    };

    // --- 5. HÀM LƯU EPISODE ---
    const handleSaveEpisode = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                episode_number: parseInt(episodeModal.data.episode_number),
                title: episodeModal.data.title,
                video_url: episodeModal.data.video_url,
                duration: parseInt(episodeModal.data.duration) || 0
            };

            if (episodeModal.type === 'add') {
                await adminApi.addEpisode(selectedSeasonId, payload);
                toast.success("Thêm Tập (Episode) thành công!");
            } else {
                await adminApi.updateEpisode(episodeModal.data.id, payload);
                toast.success("Cập nhật Tập thành công!");
            }
            setEpisodeModal({ isOpen: false, type: 'add', data: null });
            fetchEpisodes(selectedSeasonId);
        } catch (error) {
            toast.error("Lỗi khi lưu Episode!");
            console.error(error);
        }
    };

    const handleDeleteEpisode = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa tập này?")) return;
        try {
            await adminApi.deleteEpisode(id);
            toast.success("Đã xóa!");
            fetchEpisodes(selectedSeasonId);
        } catch (error) {
            console.error("Lỗi chi tiết:", error);
            toast.error("Lỗi khi xóa!");
        }
    };

    return (
        <div className="space-y-6 relative h-full flex flex-col">
            {/* Header & Chọn Phim */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý Tập Phim (Season & Episode)</h1>
                <div className="max-w-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">1. Chọn bộ phim cần quản lý:</label>
                    <select 
                        value={selectedMovieId} 
                        onChange={(e) => setSelectedMovieId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 font-medium"
                    >
                        <option value="">-- Click để chọn phim --</option>
                        {movies.map(m => (
                            <option key={m.id} value={m.id}>
                                #{m.id} - {m.title} ({m.type === 'Series' ? 'Phim Bộ' : 'Phim Lẻ'})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* KHU VỰC CHIA 2 CỘT (Chỉ hiện khi đã chọn phim) */}
            {selectedMovieId ? (
                <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
                    
                    {/* CỘT TRÁI: DANH SÁCH SEASON */}
                    <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center sticky top-0">
                            <h2 className="font-bold text-gray-800">2. Danh sách Phần (Seasons)</h2>
                            <button 
                                onClick={() => setSeasonModal({ isOpen: true, type: 'add', data: { season_number: seasons.length + 1, title: `Phần ${seasons.length + 1}`, description: '' } })}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                                + Thêm Phần
                            </button>
                        </div>
                        <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto hide-scrollbar">
                            {isLoading && !selectedSeasonId ? <div className="text-center p-4 text-gray-500">Đang tải...</div> : null}
                            {seasons.length === 0 && !isLoading && <div className="text-center p-4 text-gray-500">Chưa có phần nào.</div>}
                            
                            {seasons.map(season => (
                                <div 
                                    key={season.id} 
                                    onClick={() => setSelectedSeasonId(season.id)}
                                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${selectedSeasonId === season.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-transparent hover:bg-gray-50 border-b-gray-100'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`font-bold ${selectedSeasonId === season.id ? 'text-blue-700' : 'text-gray-800'}`}>Phần {season.season_number}: {season.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{season.description || 'Không có mô tả'}</p>
                                        </div>
                                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setSeasonModal({ isOpen: true, type: 'edit', data: season })} className="text-yellow-600 hover:text-yellow-800 text-sm">Sửa</button>
                                            <button onClick={() => handleDeleteSeason(season.id)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CỘT PHẢI: DANH SÁCH EPISODE */}
                    <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
                        {!selectedSeasonId ? (
                            <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400 bg-gray-50">
                                👈 Vui lòng chọn một Phần (Season) ở cột bên trái để xem các Tập
                            </div>
                        ) : (
                            <>
                                <div className="p-4 bg-gray-50 border-b flex justify-between items-center sticky top-0">
                                    <h2 className="font-bold text-gray-800">
                                        3. Tập Phim thuộc Phần {seasons.find(s => s.id === selectedSeasonId)?.season_number}
                                    </h2>
                                    <button 
                                        onClick={() => setEpisodeModal({ isOpen: true, type: 'add', data: { episode_number: episodes.length + 1, title: `Tập ${episodes.length + 1}`, video_url: '', duration: '' } })}
                                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                    >
                                        + Thêm Tập mới
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto hide-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="bg-white border-b sticky top-0 text-sm text-gray-600">
                                            <tr>
                                                <th className="px-4 py-3 w-16">Tập số</th>
                                                <th className="px-4 py-3">Tiêu đề & Link Video</th>
                                                <th className="px-4 py-3 w-24">Thời lượng</th>
                                                <th className="px-4 py-3 text-right w-24">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr><td colSpan="4" className="text-center py-6 text-gray-500">Đang tải...</td></tr>
                                            ) : episodes.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center py-10 text-gray-500 font-medium">Chưa có tập nào trong phần này. Hãy thêm tập mới!</td></tr>
                                            ) : (
                                                episodes.map(epi => (
                                                    <tr key={epi.id} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-bold text-gray-700 text-center">{epi.episode_number}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-semibold text-gray-800">{epi.title}</div>
                                                            <div className="text-xs text-blue-600 truncate max-w-[300px] mt-0.5" title={epi.video_url}>{epi.video_url || 'Chưa có link video'}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">{epi.duration ? `${epi.duration} phút` : 'N/A'}</td>
                                                        <td className="px-4 py-3 text-right space-x-3">
                                                            <button onClick={() => setEpisodeModal({ isOpen: true, type: 'edit', data: epi })} className="text-yellow-600 font-medium text-sm">Sửa</button>
                                                            <button onClick={() => handleDeleteEpisode(epi.id)} className="text-red-600 font-medium text-sm">Xóa</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50/50">
                    Hãy chọn một bộ phim ở trên để bắt đầu thêm các Phần và Tập nhé!
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL SEASON */}
            {seasonModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">{seasonModal.type === 'add' ? 'Thêm Phần mới' : 'Sửa Phần'}</h2>
                        <form onSubmit={handleSaveSeason} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Số thứ tự phần *</label>
                                    <input required type="number" min="1" className="w-full border rounded p-2" value={seasonModal.data.season_number} onChange={e => setSeasonModal({...seasonModal, data: {...seasonModal.data, season_number: e.target.value}})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tiêu đề phần</label>
                                    <input type="text" className="w-full border rounded p-2" value={seasonModal.data.title || ''} onChange={e => setSeasonModal({...seasonModal, data: {...seasonModal.data, title: e.target.value}})} placeholder="VD: Phần 1..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả tóm tắt</label>
                                <textarea rows="3" className="w-full border rounded p-2 resize-none" value={seasonModal.data.description || ''} onChange={e => setSeasonModal({...seasonModal, data: {...seasonModal.data, description: e.target.value}})}></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                                <button type="button" onClick={() => setSeasonModal({isOpen: false})} className="px-4 py-2 bg-gray-100 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu Phần</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EPISODE */}
            {episodeModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-green-700">{episodeModal.type === 'add' ? 'Thêm Tập mới' : 'Sửa Tập Phim'}</h2>
                        <form onSubmit={handleSaveEpisode} className="space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1">Tập số *</label>
                                    <input required type="number" min="1" className="w-full border rounded p-2" value={episodeModal.data.episode_number} onChange={e => setEpisodeModal({...episodeModal, data: {...episodeModal.data, episode_number: e.target.value}})} />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium mb-1">Tên tập</label>
                                    <input type="text" className="w-full border rounded p-2" value={episodeModal.data.title || ''} onChange={e => setEpisodeModal({...episodeModal, data: {...episodeModal.data, title: e.target.value}})} placeholder="VD: Khởi hành..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-blue-800">URL Link Video chính (m3u8, mp4) *</label>
                                <input required type="text" className="w-full border-blue-300 border-2 rounded p-2 focus:ring-blue-500" value={episodeModal.data.video_url || ''} onChange={e => setEpisodeModal({...episodeModal, data: {...episodeModal.data, video_url: e.target.value}})} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
                                <input type="number" min="0" className="w-full border rounded p-2" value={episodeModal.data.duration || ''} onChange={e => setEpisodeModal({...episodeModal, data: {...episodeModal.data, duration: e.target.value}})} />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button type="button" onClick={() => setEpisodeModal({isOpen: false})} className="px-4 py-2 bg-gray-100 rounded">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700">Lưu Tập phim</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSeasonEpisode;