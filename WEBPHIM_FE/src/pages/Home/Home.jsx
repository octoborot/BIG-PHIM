import React, { useState, useEffect } from 'react';
import movieApi from '../../api/movieApi';
import MovieCard from '../../components/movie/MovieCard';
import historyApi from '../../api/historyApi';

// ================= COMPONENT DÙNG CHUNG CHO CÁC HÀNG CUỘN NGANG =================
const HorizontalMovieList = ({ title, data, borderColor = "border-red-600", renderBadge }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="mb-4">
            <h2 className={`text-xl md:text-2xl font-bold text-white mb-1 border-l-4 ${borderColor} pl-3 flex items-center gap-2`}>
                {title}
            </h2>
            {/* SỬA Ở ĐÂY: Thêm pt-4 (padding-top) và px-2 để có không gian cho thẻ phim "nhô" lên mà không bị cắt */}
            <div className="flex space-x-4 overflow-x-auto pt-6 pb-6 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {data.map((item) => {
                    const movie = item.episode?.season?.movie || item;
                    if (!movie) return null;

                    return (
                        /* SỬA Ở ĐÂY: Dùng hover:-translate-y-2 (nhích lên) và hover:scale-105 (phóng to nhẹ) */
                        <div 
                            key={item.id} 
                            className="w-[40vw] sm:w-[28vw] md:w-[20vw] lg:w-[16vw] xl:w-[240px] flex-none snap-start relative"                        >
                            <MovieCard movie={movie} />
                            {renderBadge && renderBadge(item)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ================= COMPONENT CHÍNH TRANG CHỦ =================
const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. STATE CHO THANH TÌM KIẾM
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // 2. STATE CHO CÁC DANH SÁCH CUỘN NGANG
    const [historyList, setHistoryList] = useState([]);
    const [koreanSeries, setKoreanSeries] = useState([]);
    const [animeSeries, setAnimeSeries] = useState([]);
    const [animeMovies, setAnimeMovies] = useState([]);
    const [marvelSeries, setMarvelSeries] = useState([]);
    const [randomSeries, setRandomSeries] = useState([]);
    const [newSeries, setNewSeries] = useState([]);

    // 3. KỸ THUẬT DEBOUNCE TÌM KIẾM
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // 4. GỌI API LẤY PHIM THEO THỂ LOẠI & TÌM KIẾM
    useEffect(() => {
        const fetchMovies = async () => {
            if(debouncedSearch.trim() === '') {
                setMovies([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await movieApi.getAll({ search: debouncedSearch });
                if (response.success) {
                    setMovies(response.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải phim:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [debouncedSearch]);

    // 5. GỌI API LỊCH SỬ XEM
    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await historyApi.getList({limit: 10});
                if (res.success) {
                    setHistoryList(res.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải lịch sử:", error);
            }
        };
        fetchHistory();
    }, []);

    // 6. GỌI API LẤY PHIM THEO TOPIC "SERIES HÀN"
    useEffect(() => {
        const fetchKoreanSeries = async () => {
            try {
                // LƯU Ý QUAN TRỌNG: Hãy đổi số '1' thành ID thực tế của Topic "Series Hàn" trong Database của bạn
                const response = await movieApi.getAll({ topic_id: 3, limit: 10 });
                const responseData = response.data?.data || response.data || response;
                if (responseData && responseData.length > 0) {
                    setKoreanSeries(responseData);
                }

                const responseMarvel = await movieApi.getAll({ topic_id: 7 });
                const responseMarvelData = responseMarvel.data?.data || responseMarvel.data || responseMarvel;
                if (responseMarvelData && responseMarvelData.length > 0) {
                    setMarvelSeries(responseMarvelData);
                }

                const responseAnimeSeries = await movieApi.getAll({ topic_id: 9 });
                const responseAnimeSeriesData = responseAnimeSeries.data?.data || responseAnimeSeries.data || responseAnimeSeries;  
                if (responseAnimeSeriesData && responseAnimeSeriesData.length > 0) {
                    setAnimeSeries(responseAnimeSeriesData);
                }

                const responseAnimeMovies = await movieApi.getAll({ topic_id: 8 });
                const responseAnimeMoviesData = responseAnimeMovies.data?.data || responseAnimeMovies.data || responseAnimeMovies;
                if (responseAnimeMoviesData && responseAnimeMoviesData.length > 0) {
                    setAnimeMovies(responseAnimeMoviesData);
                }

                const responseRandom = await movieApi.getRandom();
                const responseRandomData = responseRandom.data?.data || responseRandom.data || responseRandom; 
                if (responseRandomData && responseRandomData.length > 0) {
                    setRandomSeries(responseRandomData);
                }

                const responseNew = await movieApi.getAll();
                const responseNewData = responseNew.data?.data || responseNew.data || responseNew;
                if (responseNewData && responseNewData.length > 0) {
                    setNewSeries(responseNewData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phim: ", error);
            }
        };
        fetchKoreanSeries();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2 flex flex-col items-center">
                <div className="relative w-full md:w-1/2 lg:w-1/2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Bạn muốn xem gì hôm nay?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition shadow-inner"
                    />
                </div>
            </div>

            {/* ================= 2. KHU VỰC LƯỚI PHIM (CHỈ HIỂN THỊ KHI CÓ GÕ CHỮ) ================= */}
            <div className="px-4 md:px-8 pb-8 pt-0 max-w-7xl mx-auto">
                {debouncedSearch.trim() !== '' && (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                Kết quả tìm kiếm cho: <span className="text-red-500">"{debouncedSearch}"</span>
                            </h2>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-sm text-gray-400 hover:text-white underline"
                            >
                                Hủy tìm kiếm
                            </button>
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                            </div>
                        ) : movies.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10 text-lg bg-gray-800 p-10 rounded-xl border border-gray-700 shadow-lg">
                                🍿 Không tìm thấy bộ phim nào phù hợp!
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {movies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ================= KHU VỰC CÁC HÀNG PHIM CUỘN NGANG ================= */}
            <div className="px-4 md:px-8 pb-0 max-w-7xl mx-auto">
                {!debouncedSearch && (
                    <>
                        <HorizontalMovieList
                            title="Phim Mới Cập Nhật"
                            data={newSeries}
                            borderColor="border-red-500"
                        />

                        <HorizontalMovieList
                            title="Phim Đề Xuất Ngẫu Nhiên"
                            data={randomSeries}
                            borderColor="border-red-500"
                        />

                        {/* Hàng 1: Lịch sử xem (Có badge Tập) */}
                        <HorizontalMovieList
                            title="Tiếp tục xem"
                            data={historyList}
                            borderColor="border-red-600"
                            renderBadge={(item) => {
                            // Lấy thông tin phim từ dữ liệu lịch sử (item ở đây là bản ghi history)
                            const movie = item.episode?.season?.movie;

                            // Kiểm tra điều kiện: Chỉ hiện nhãn nếu type là 'Series'
                            if (movie?.type === 'Series') {
                                return (
                                    <div className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/40 backdrop-blur-md border border-white/20 shadow-lg tracking-wide z-10">
                                        Tập {item.episode?.episode_number}
                                    </div>
                                );
                            }

                            // Nếu là 'single' hoặc các loại khác, trả về null để không hiển thị gì cả
                            return null;
                        }}
                        />

                        <HorizontalMovieList
                            title="Marvel Series"
                            data={marvelSeries}
                            borderColor="border-red-700"
                        />

                        <HorizontalMovieList
                            title="Anime Series"
                            data={animeSeries}
                            borderColor="border-red-500"
                        />

                        <HorizontalMovieList
                            title="Anime Movies"
                            data={animeMovies}
                            borderColor="border-red-500"
                        />

                        {/* Hàng 2: Series Hàn Quốc */}
                        <HorizontalMovieList
                            title="Series Hàn Quốc Đỉnh Cao"
                            data={koreanSeries}
                            borderColor="border-red-500"
                        />
                    </>
                )}
            </div>

        </div>
    );
};

export default Home;