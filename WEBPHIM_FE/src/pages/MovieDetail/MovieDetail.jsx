import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieApi from '../../api/movieApi';
import historyApi from '../../api/historyApi';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeSeason, setActiveSeason] = useState(null);
    const [activeEpisode, setActiveEpisode] = useState(null);
    const TMDB_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const handleEpisodeClick = (ep) => {
        // Nếu người dùng bấm vào tập đang xem thì bỏ qua
        if (activeEpisode?.id === ep.id) return; 
        
        setActiveEpisode(ep); // Cập nhật tập mới
        
        // Tự động cuộn mượt mà lên đầu trang (khu vực video)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const response = await movieApi.getById(id);
                if (response.success) {
                    setMovie(response.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải chi tiết phim:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovieDetail();
    }, [id]);

    useEffect(() => {
        if (movie && movie.season && movie.season.length > 0) {
            const firstSeason = movie.season[0];
            setActiveSeason(firstSeason);
            
            const eps = firstSeason.episode || firstSeason.episodes || [];
            if (eps.length > 0) {
                setActiveEpisode(eps[0]);
            }
        }
    }, [movie]);

    useEffect(() => {
        if (activeEpisode) {
            const saveWatchHistory = async () => {
                const token = localStorage.getItem('token');
                if (!token) return;

                try {
                    await historyApi.save({
                        episode_id: activeEpisode.id,
                        progress_second: 0,
                        is_completed: false
                    });
                } catch (error) {
                    console.error("Lỗi khi lưu lịch sử:", error);
                }
            };
            saveWatchHistory();
        }
    }, [activeEpisode]);

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex justify-center items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div></div>;
    }

    if (!movie) {
        return <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
            <h2 className="text-2xl mb-4">Phim không tồn tại hoặc đã bị xóa.</h2>
            <button onClick={() => navigate('/')} className="bg-red-600 px-6 py-2 rounded">Về trang chủ</button>
        </div>;
    }

    // Logic bảo vệ link video an toàn
    const getValidUrl = (url) => {
        if (url && url.trim() !== '') {
            // Kiểm tra xem URL đã có dấu '?' chưa để nối thêm tham số autoplay
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}autoplay=1`;
        }
        return null;
    };
    
    const videoToPlay = getValidUrl(activeEpisode?.video_url) || getValidUrl(movie?.trailer_url);
    const genres = movie?.movie_genre?.map(mg => mg.genre?.name).join(', ') || 'Đang cập nhật';

    // XỬ LÝ DỮ LIỆU ĐOÀN LÀM PHIM: Lọc Đạo diễn và Diễn viên
    // Lưu ý: Đổi chữ 'DIRECTOR' và 'ACTOR' cho khớp với giá trị enum trong DB của bạn
    const directors = movie?.movie_person?.filter(mp => mp.role === 'DIRECTOR' || mp.role === 'director').map(mp => mp.person) || [];
    const actors = movie?.movie_person?.filter(mp => mp.role === 'ACTOR' || mp.role === 'actor').map(mp => mp.person) || [];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Nút Quay Lại */}
            <div className="absolute top-4 left-4 z-50">
                <button onClick={() => navigate('/')} className="bg-black/50 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            </div>

            {/* KHU VỰC VIDEO PLAYER */}
            <div className="w-full bg-black aspect-video flex justify-center items-center shadow-2xl shadow-black mb-8">
                {videoToPlay ? (
                    <iframe 
                        className="w-full max-w-6xl aspect-video"
                        src={videoToPlay} 
                        title={activeEpisode?.title || movie?.title}
                        frameBorder="0" 
                        allowFullScreen
                        allow="autoplay; fullscreen"
                    ></iframe>
                ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p>Đang cập nhật link phim...</p>
                    </div>
                )}
            </div>

            {/* KHU VỰC THÔNG TIN PHIM */}
            <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="hidden md:block w-1/4 flex-shrink-0 mt-2">
                    <img 
                        src={movie.poster_url ? `${TMDB_BASE_URL}${movie.poster_url}` : 'https://via.placeholder.com/300x450'}
                        alt={movie.title} 
                        className="w-full rounded-xl shadow-2xl border-2 border-gray-700 object-cover aspect-[2/3]" 
                    />                
                </div>
                
                <div className="flex-1 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                        {movie.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-medium">
                        <span className="bg-gray-800 px-3 py-1 rounded-md text-white border border-gray-600">{movie.release_year || 'N/A'}</span>
                        <span className="flex items-center text-yellow-500 bg-gray-800 px-3 py-1 rounded-md border border-gray-600">⭐ {movie.rating?.toFixed(1) || '0.0'}</span>
                        <span className="bg-red-900/50 text-red-200 px-3 py-1 rounded-md border border-red-800">{movie.age_rating || '13+'}</span>
                        <span>{genres}</span>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mt-4">{movie.description || 'Chưa có mô tả cho bộ phim này.'}</p>

                    {/* === KHU VỰC PHIM MỚI THÊM === */}
                    <div className="mt-6 border-t border-gray-800 pt-6">
                        {/* Đạo diễn */}
                        {directors.length > 0 && (
                            <div className="mb-4 text-sm md:text-base">
                                <span className="text-gray-400 font-semibold mr-2">Đạo diễn:</span>
                                <span className="text-white hover:text-red-500 cursor-pointer transition">{directors.map(d => d.name).join(', ')}</span>
                            </div>
                        )}

                        {/* Diễn viên */}
                        {actors.length > 0 && (
                            <div>
                                <span className="text-gray-400 font-semibold mb-3 block text-sm md:text-base">Diễn viên chính:</span>
                                {/* Dùng flex tràn viền ngang (scroll-x) để hiện danh sách Avatar */}
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {actors.map((actor, index) => (
                                        <div key={index} className="flex flex-col items-center min-w-[80px] group cursor-pointer">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-red-500 transition-all duration-300 mb-2">
                                                <img
                                                    src={actor.avatar_url ? `${TMDB_BASE_URL}${actor.avatar_url}` : 'https://via.placeholder.com/150'}
                                                    alt={actor.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                />
                                            </div>
                                            <span className="text-xs md:text-sm text-center text-gray-300 w-20 md:w-24 truncate group-hover:text-white transition" title={actor.name}>
                                                {actor.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ========================================= */}
                </div>
            </div>

            {/* KHU VỰC DANH SÁCH CHỌN TẬP PHIM */}
            {movie.season && movie.season.length > 0 && (
                <div className="max-w-6xl mx-auto p-6 md:p-10 mt-2 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-red-600 pl-3">Danh Sách Tập Phim</h2>

                        {movie.season.length > 1 && (
                            <select 
                                className="bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 outline-none focus:border-red-600 transition"
                                value={activeSeason?.id || ''}
                                onChange={(e) => {
                                    const selectedSeason = movie.season.find(s => s.id === parseInt(e.target.value));
                                    setActiveSeason(selectedSeason);
                                }}
                            >
                                {movie.season.map((s, index) => (
                                    <option key={s.id} value={s.id}>
                                        {s.title || `Phần ${index + 1}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(() => {
                            const episodes = activeSeason?.episode || activeSeason?.episodes || [];
                            
                            if (episodes.length === 0) {
                                return <p className="text-gray-500 italic">Đang cập nhật tập phim cho phần này...</p>;
                            }

                            return episodes.map((ep, index) => (
                                <div 
                                    key={ep.id} 
                                    onClick={() => handleEpisodeClick(ep)}
                                    className={`cursor-pointer group rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                        activeEpisode?.id === ep.id 
                                        ? 'border-red-600 scale-[1.02] shadow-lg shadow-red-900/40' 
                                        : 'border-gray-800 hover:border-gray-600'
                                    }`}
                                >
                                    <div className="aspect-video bg-gray-800 relative flex items-center justify-center overflow-hidden">
                                        <img src={movie.poster_url ? `${TMDB_BASE_URL}${movie.poster_url}` : 'https://via.placeholder.com/300x170'} alt="thumbnail" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition" />
                                        
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black/50 rounded-full p-2 group-hover:bg-red-600 transition">
                                                <svg className={`w-8 h-8 ${activeEpisode?.id === ep.id ? 'text-red-500 group-hover:text-white' : 'text-white'}`} fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                                            </div>
                                        </div>
                                        
                                        <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-bold px-2 py-1 rounded text-gray-300">
                                            Tập {ep.episode_number || index + 1}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-gray-900">
                                        <h4 className={`font-medium truncate ${activeEpisode?.id === ep.id ? 'text-red-500' : 'text-gray-300 group-hover:text-white'}`}>
                                            {ep.title || `Tập ${ep.episode_number || index + 1}`}
                                        </h4>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;