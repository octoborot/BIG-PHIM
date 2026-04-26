import React, { useState } from 'react';
import AuthContext from './AuthContext';

const getInitialAuth = () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    if (token && user_id) {
        return {
            token,
            user: {
                id: user_id,
                role: role
            }
        };
    }

    return {
        token: null,
        user: null
    };
};

export const AuthProvider = ({ children }) => {
    const initialAuth = getInitialAuth();

    const [token, setToken] = useState(initialAuth.token);
    const [user, setUser] = useState(initialAuth.user);
    const [isLoading] = useState(false);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user_id', userData.id);
        localStorage.setItem('role', userData.role);

        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};