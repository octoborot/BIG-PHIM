import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import favoriteApi from '../../api/favoriteApi';
import { useFavorites } from '../../context/FavoriteContext';
import { toast }  from 'react-toastify';

const NO_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const getValidImageUrl = (url) => {
        if (!url) return NO_IMAGE_URL;
        
        // Xóa khoảng trắng thừa
        let cleanUrl = url.trim();

        // Nếu phát hiện link TMDB, cho qua trạm trung chuyển wsrv.nl
        if (cleanUrl.includes('tmdb.org')) {
            // Xóa https:// ở đầu để ghép link proxy cho mượt
            const urlWithoutProtocol = cleanUrl.replace(/^https?:\/\//, '');
            return `https://wsrv.nl/?url=${urlWithoutProtocol}`;
        }

        return cleanUrl;
    };
    const [imgSrc, setImgSrc] = useState(getValidImageUrl(movie.poster_url));
    
    // State quản lý màu sắc của Trái Tim
    const { favoriteSet, favoriteIds, setFavoriteIds } = useFavorites();

    const movieId = Number(movie.id);
    const isFavorite = movieId && favoriteSet.has(movieId);
    // ==========================================
    // 1. STATE & REF CHO TÍNH NĂNG AUTO-PLAY TRAILER
    // ==========================================
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeoutRef = useRef(null);

    // Xử lý khi chuột đưa vào
    const handleMouseEnter = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
        }, 500); // Trễ 500ms mới hiện video
    };

    // Xử lý khi chuột rời đi
    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setIsHovered(false);
    };

    // Dọn dẹp timeout nếu component bị hủy (người dùng chuyển trang nhanh)
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // Hàm chuyển đổi link YouTube thường thành link embed
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    // Lấy link trailer (LƯU Ý: Đổi 'trailer_url' thành đúng tên trường dữ liệu từ API của bạn)
    const trailerEmbedUrl = getEmbedUrl(movie.trailer_url); 
    // ==========================================

    // HÀM XỬ LÝ KHI BẤM NÚT TRÁI TIM
    const handleToggleFavorite = async (e) => {
        e.stopPropagation(); 
        
        const token = localStorage.getItem('token'); 
        if (!token) {
            toast.error("Bạn cần đăng nhập để lưu phim yêu thích!");
            return;
        }

        // Sao lưu lại mảng cũ để phòng hờ gọi API bị lỗi thì còn có cái mà khôi phục
        const previousFavorites = [...favoriteIds];

        // Lạc quan: Đổi màu trên giao diện trước
        if (!isFavorite) {
            setFavoriteIds([...new Set([...favoriteIds, Number(movie.id)])]);
        } else {
            setFavoriteIds(favoriteIds.filter(id => String(id) !== String(movie.id)));
        }

        // Bắn dữ liệu xuống Backend sau
        try {
            if (!isFavorite) {
                // Đã sửa thành movieId để khớp 100% với Backend
                await favoriteApi.add({ movieId: movie.id }); 
            } else {
                await favoriteApi.remove(movie.id);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật danh sách yêu thích:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
            
            // Quay xe: Trả lại trạng thái trái tim như lúc chưa bấm
            setFavoriteIds(previousFavorites); 
        }
    };

    const formatReleaseDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        
        // Dùng 'vi-VN' để ép định dạng theo chuẩn Việt Nam (Ngày/Tháng/Năm)
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',   // Hiển thị ngày 2 chữ số (VD: 07)
            month: '2-digit', // Hiển thị tháng 2 chữ số (VD: 11)
            year: 'numeric'   // Hiển thị năm 4 chữ số (VD: 2014)
        });
    };

    return (
        <div 
            onClick={() => navigate(`/movie/${movie.id}`)}
            // 2. THÊM SỰ KIỆN CHUỘT VÀO THẺ BAO NGOÀI CÙNG
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative group cursor-pointer bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-cyan-900/40 transition-all duration-300 transform hover:-translate-y-2.5 border border-gray-700/50 hover:border-cyan-700"
        >
            {/* 💖 NÚT THẢ TIM */}
            <button
                onClick={handleToggleFavorite}
                className="absolute top-2 right-2 z-30 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/90 hover:scale-110 transition-all duration-200 shadow-lg"
                title="Thêm vào danh sách yêu thích"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-300'}`}
                    fill={isFavorite ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={isFavorite ? 0 : 2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {/* KHU VỰC ẢNH BÌA VÀ TRAILER */}
            <div className="aspect-[2/3] w-full overflow-hidden bg-gray-950 relative">
                {/* Ảnh bìa phim */}
                <img 
                    src={imgSrc} 
                    alt={movie.title} 
                    loading="lazy"
                    decoding="async"
                    // 3. ẨN ẢNH ĐI NẾU VIDEO ĐANG PHÁT ĐỂ KHÔNG BỊ CHỒNG LÊN NHAU
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isHovered && trailerEmbedUrl ? 'opacity-0' : 'opacity-100'}`}
                    onError={() => setImgSrc(NO_IMAGE_URL)} 
                />

                {/* 4. IFRAME TRAILER SẼ RENDER KHI HOVER */}
                {isHovered && trailerEmbedUrl && (
                    <div className="absolute inset-0 bg-black z-10">
                        <iframe
                            src={`${trailerEmbedUrl}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${trailerEmbedUrl.split('/').pop()}`}
                            title={movie.title}
                            className="w-full h-full scale-[1.35] pointer-events-none" // pointer-events-none giúp vẫn bấm được vào Card để chuyển trang
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>
            
            {/* Thông tin phim (Giữ nguyên, tự động nổi lên trên cùng do luồng flex/absolute) */}
            <div className="p-3 md:p-4 bg-gray-900/80 backdrop-blur-sm absolute bottom-0 left-0 right-0 border-t border-gray-700 z-20">
                <h3 className="text-white font-bold text-base md:text-lg truncate group-hover:text-red-500 transition" title={movie.title}>
                    {movie.title}
                </h3>
                <div className="flex justify-between items-center mt-1.5 text-xs md:text-sm text-gray-400">
                    <span>{formatReleaseDate(movie.release_date || movie.release_year)}</span>
                    <span className="flex items-center text-yellow-500 font-medium">
                        ⭐ {
                                movie.age_rating 
                                    ? Number(movie.age_rating).toFixed(1) 
                                    : '0.0'
                            }
                    </span>
                </div>
            </div>

            {/* Nút Play (Chỉ hiện khi hover VÀ phim không có trailer hoặc chưa kịp phát) */}
            {(!isHovered || !trailerEmbedUrl) && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-14 h-14 flex items-center justify-center bg-red-600/90 text-white rounded-full shadow-xl shadow-red-900/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-7 h-7" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCard;