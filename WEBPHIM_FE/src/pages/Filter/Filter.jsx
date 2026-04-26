import React, { useState, useEffect } from 'react';
import filterApi from '../../api/filterApi';
import MovieCard from '../../components/movie/MovieCard';

const Filter = () => {
    const [isActive, setIsActive] = useState(false);
    const [genre, setGenre] = useState([]);
    const [topic, setTopic] = useState([]);
    const [movie, setMovie] = useState([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState([]);
    const [selectedTopicIds, setSelectedTopicIds] = useState([]);

    // Tải dữ liệu ban đầu
    const fetchInitialData = async () => {
        try {
            const [resGenre, resTopic, resMovies] = await Promise.all([
                filterApi.getGenre(),
                filterApi.getTopics(),
                filterApi.getFilter({ page: 1, limit: 10 }) 
            ]);

            if (resGenre) setGenre(resGenre.data?.data || resGenre.data || []);
            if (resTopic) setTopic(resTopic.data?.data || resTopic.data || []);
            
            if (resMovies) {
                const movieData = resMovies.data?.data || resMovies.data || [];
                setMovie(movieData);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu ban đầu:", error);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleToggleSelect = (id, type) => {
        if (type === 'genre') {
            setSelectedGenreIds(prev => 
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
        } else {
            setSelectedTopicIds(prev => 
                prev.includes(id) ? [] : [id]
            );
        }
    };

    const handleFilter = async () => {
        try {
            const params = {
                page: 1,
                limit: 10,
            };

            if (selectedGenreIds.length > 0) {
                params.genre_id = selectedGenreIds.join(',');
            }

            if (selectedTopicIds.length > 0) {
                params.topic_id = selectedTopicIds[0];
            }

            // In ra xem params đã gom đủ ID chưa
            console.log("🚀 Đang gửi dữ liệu lọc lên Backend:", params); 

            const res = await filterApi.getFilter(params);
            
            // SỬA Ở ĐÂY: Dùng chung cách bóc tách an toàn như fetchInitialData
            const movieData = res.data?.data || res.data || [];
            
            // Ghi đè danh sách phim mới vào State
            setMovie(movieData);

        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim lọc:", error);
        } finally {
            setIsActive(false); // Đóng menu lọc
        }
    };

    // Hàm tiện ích để xóa bộ lọc khi không tìm thấy kết quả
    const handleClearFilter = () => {
        setSelectedGenreIds([]);
        setSelectedTopicIds([]);
        fetchInitialData(); // Gọi lại danh sách mặc định
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            
            {/* --- KHU VỰC NÚT VÀ MENU BỘ LỌC --- */}
            <div className="p-4">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`text-sm px-4 py-1.5 rounded-full border transition flex items-center gap-2 shrink-0 ${
                        isActive 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {isActive ? 'Đóng bộ lọc' : 'Bộ lọc'}
                </button>

                {isActive && (
                    <div className="bg-gray-900 border border-gray-800 w-full mt-3 p-5 rounded-xl shadow-2xl">
                        
                        {/* Thể loại */}
                        <div className="mb-5">
                            <h3 className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Thể loại (Có thể chọn nhiều)</h3>
                            <div className="flex flex-wrap gap-2">
                                {genre.map(g => (
                                    <button
                                        key={g.id}
                                        onClick={() => handleToggleSelect(g.id, 'genre')}
                                        className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                                            selectedGenreIds.includes(g.id) 
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_8px_rgba(37,99,235,0.4)]' 
                                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chủ đề */}
                        <div className="mb-6">
                            <h3 className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Chủ đề (Chỉ chọn 1)</h3>
                            <div className="flex flex-wrap gap-2">
                                {topic.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleToggleSelect(t.id, 'topic')}
                                        className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                                            selectedTopicIds.includes(t.id) 
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_8px_rgba(5,150,105,0.4)]' 
                                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Nút Áp dụng */}
                        <div className="flex justify-end border-t border-gray-800 pt-4">
                            <button 
                                onClick={handleFilter}
                                className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg font-bold transition-colors active:scale-95"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- KHU VỰC HIỂN THỊ PHIM --- */}
            <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movie.length > 0 ? (
                        // Dùng MovieCard thay vì tự gõ HTML chay
                        movie.map(m => (
                            <MovieCard key={m.id} movie={m} />
                        ))
                    ) : (
                        /* Giao diện khi mảng rỗng (Lấy từ MyList.jsx nhưng đổi text và icon) */
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800 mt-4">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                {/* Đổi thành icon Kính lúp cho hợp ngữ cảnh lọc phim */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-300">Không tìm thấy phim nào có kết quả lọc như này!</h3>
                            <p className="text-gray-500 mt-2 mb-6">Hãy thử thay đổi các tiêu chí thể loại hoặc chủ đề xem sao nhé.</p>
                            <button 
                                onClick={handleClearFilter}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg shadow-red-900/40"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Filter;