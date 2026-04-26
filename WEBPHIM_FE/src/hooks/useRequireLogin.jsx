import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useRequireLogin = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    return (action) => {
        if (!token) {
            if (toast.isActive('login-required')) return;

            toast.info(
                ({ closeToast }) => (
                    <div className="w-[270px]">
                        
                        {/* HEADER */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 text-xl">
                                🔒
                            </div>

                            <div className="flex-1">
                                <p className="text-white font-semibold text-sm">
                                    Bạn chưa đăng nhập
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                    Đăng nhập để tiếp tục sử dụng tính năng này
                                </p>
                            </div>
                        </div>

                        {/* ACTION */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={closeToast}
                                className="flex-1 py-1.5 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-white transition"
                            >
                                Để sau
                            </button>

                            <button
                                onClick={() => {
                                    localStorage.setItem(
                                        'redirectAfterLogin',
                                        window.location.pathname
                                    );
                                    navigate('/login');
                                    closeToast();
                                }}
                                className="flex-1 py-1.5 text-xs rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                ),
                {
                    toastId: 'login-required', // 👈 chống spam
                    autoClose: 5000, // 👈 hợp lý hơn
                    closeOnClick: false,
                    hideProgressBar: true,
                    style: {
                        background: '#111827',
                        borderRadius: '16px',
                        border: '1px solid #374151',
                        padding: '14px'
                    }
                }
            );

            return;
        }

        action?.();
    };
};