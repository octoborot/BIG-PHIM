import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import MyList from './pages/MyList/MyList';
import Navbar from './components/Navbar';
import Filter from './pages/Filter/Filter';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminGenreTopic from './pages/admin/AdminGenreTopic';
import AdminSeasonEpisode from './pages/admin/AdminSeasonEpisode';
import AdminUser from './pages/admin/AdminUser';
import AdminDetail from './pages/admin/AdminDetail';

// Import Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import AuthContext
import { AuthProvider} from './context/AuthProvider';
import { useAuth } from "./context/useAuth";

// Middleware kiểm tra đăng nhập
const ProtectedRoute = ({ children }) => {
    const { token, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><p className="text-white">Đang tải...</p></div>;
    }
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// VỎ BỌC CHO GIAO DIỆN USER (Hiển thị Navbar chung)
const UserLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet /> {/* Các trang Home, Filter, Profile... sẽ chui vào đây */}
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

// Component riêng để chứa routes (để có thể dùng useAuth hook)
function AppRoutes() {
    // 🔧 Kiểm tra token khi app load lần đầu
    const { token } = useAuth();
    
    useEffect(() => {
        if (token) {
            console.log("✅ Token tìm thấy khi load trang:", token.substring(0, 20) + "...");
        } else {
            console.log("⚠️ Không có token, sẽ redirect về login nếu truy cập route protected");
        }
    }, [token]);

    return (
        /* Dùng Fragment <> </> để bọc Routes và ToastContainer */
        <>
            <Routes>
                {/* ================= PUBLIC ROUTES (Đăng nhập/Đăng ký không cần Navbar) ================= */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* ================= USER ROUTES (Đã bọc thêm Navbar ở trên đầu) ================= */}
                <Route element={<UserLayout />}>
                    {/* PUBLIC */}
                    <Route path="/" element={<Home />} />
                    <Route path="/movie/:id" element={<MovieDetail />} />
                    <Route path="/filter" element={<Filter />} />

                    {/* PROTECTED */}
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/my-list" element={
                        <ProtectedRoute>
                            <MyList />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* ================= ADMIN ROUTES (Dùng Layout riêng của Admin) ================= */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="movies" element={<AdminMovies />} />
                    <Route path="gentop" element={<AdminGenreTopic />} />
                    <Route path="seaepi" element={<AdminSeasonEpisode />} />
                    <Route path="users" element={<AdminUser />} />
                    <Route path="detail" element={<AdminDetail />} />
                </Route>

                {/* ================= FALLBACK ROUTE (Chỉ để 1 cái duy nhất ở dưới cùng) ================= */}
                <Route path="*" element={<div className="text-white text-center mt-20 text-2xl">404 - Không tìm thấy trang</div>} />
            </Routes>

            {/* Đặt ToastContainer ở đây để nó luôn sẵn sàng ở mọi trang */}
            <ToastContainer 
                position="top-right" 
                autoClose={5000} /* Tự tắt sau 5s */
                hideProgressBar={false}
                newestOnTop={true} /* Thông báo mới nhất hiện lên trên */
                closeOnClick 
                pauseOnHover 
                theme="colored" /* Đổi màu xanh/đỏ rực rỡ */
            />
        </>
    );
}

export default App;