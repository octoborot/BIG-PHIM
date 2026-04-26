import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export const useAuthAction = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const executeProtectedAction = (callback) => {
        if (!token) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return;
        }

        callback?.();
    };

    return { executeProtectedAction };
};