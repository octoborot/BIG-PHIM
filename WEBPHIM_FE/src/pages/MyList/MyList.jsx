import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import favoriteApi from '../../api/favoriteApi';
import MovieCard from '../../components/movie/MovieCard';
import { useFavorites } from '../../context/FavoriteContext';

const MyList = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { favoriteIds } = useFavorites();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await favoriteApi.getMyList();

                if (res.success) {
                    setMovies(res.data); // ✅ đúng
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách yêu thích:", error);
            } finally {
                setLoading(false); // ✅ nhớ tắt loading
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        setMovies(prev => 
            prev.filter(item => favoriteIds.includes(item.movie_id))
        );
    }, [favoriteIds]);

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            {/* Header của trang */}
            <div className="pt-24 pb-10 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Danh sách của tôi</h1>
                        <p className="text-gray-400 mt-2">Những bộ phim bạn đã lưu để xem sau</p>
                    </div>
                </div>

                {/* Khu vực hiển thị danh sách phim */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {movies.map((item) => {
                            // Lấy dữ liệu phim thực sự từ object item (do API trả về lồng nhau)
                            const actualMovie = item.movie || {
                                ...item,
                                id: item.movie_id
                            };
                            
                            if (!actualMovie) return null;

                            return (
                                <MovieCard key={actualMovie.id} movie={actualMovie} />
                            );
                        })}
                    </div>
                ) : (
                    // Giao diện khi chưa có phim nào
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300">Danh sách của bạn đang trống</h3>
                        <p className="text-gray-500 mt-2 mb-6">Hãy tìm những bộ phim bạn thích và nhấn vào biểu tượng trái tim để lưu lại nhé!</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg shadow-red-900/40"
                        >
                            Khám phá phim ngay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyList;