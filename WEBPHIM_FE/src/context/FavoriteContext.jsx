import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import favoriteApi from '../api/favoriteApi';
import { toast } from 'react-toastify';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState([]);

    const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setFavoriteIds([]);
                return;
            }

            try {
                const res = await favoriteApi.getMyList();
                if (res.success) {
                    const ids = res.data
                        .map(item => item.movie_id)
                        .filter(Boolean);

                    setFavoriteIds(ids);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách thả tim:", error);
                toast.error("Lỗi khi tải danh sách thả tim!");
            }
        };

        fetchFavorites();
    }, []);

    return (
        <FavoriteContext.Provider value={{ favoriteIds, setFavoriteIds, favoriteSet }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoriteContext);