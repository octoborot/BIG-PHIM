import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const AdminGenreTopic = () => {
    // State lưu danh sách
    const [genres, setGenres] = useState([]);
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State dùng chung cho Modal (Thêm/Sửa)
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'genre', // 'genre' hoặc 'topic'
        action: 'add', // 'add' hoặc 'edit'
        editId: null,
        name: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Load dữ liệu lần đầu
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Gọi song song cả 2 API cho nhanh
            const [genresRes, topicsRes] = await Promise.all([
                adminApi.getGenres(),
                adminApi.getTopics()
            ]);
            
            if (genresRes.success || genresRes.data) setGenres(genresRes.data.data || genresRes.data);
            if (topicsRes.success || topicsRes.data) setTopics(topicsRes.data.data || topicsRes.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- XỬ LÝ MODAL THÊM / SỬA ---
    const openModal = (type, action, item = null) => {
        setModalConfig({
            isOpen: true,
            type: type,
            action: action,
            editId: item ? item.id : null,
            name: item ? item.name : ''
        });
    };

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false, name: '', editId: null });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!modalConfig.name.trim()) return toast.warning("Tên không được để trống!");
        setIsSaving(true);
        try {
            const dataToSave = { name: modalConfig.name.trim() };
            let response;

            // Xử lý lưu Thể loại (Genre)
            if (modalConfig.type === 'genre') {
                if (modalConfig.action === 'add') {
                    response = await adminApi.addGenre(dataToSave);
                } else {
                    response = await adminApi.updateGenre(modalConfig.editId, dataToSave);
                }
            } 
            // Xử lý lưu Chủ đề (Topic)
            else {
                if (modalConfig.action === 'add') {
                    response = await adminApi.addTopic(dataToSave);
                } else {
                    response = await adminApi.updateTopic(modalConfig.editId, dataToSave);
                }
            }
            toast.success(response.message || "Lưu thành công!");
            closeModal();
            fetchData(); // Tải lại danh sách
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setIsSaving(false);
        }
    };

    // --- XỬ LÝ XÓA ---
    const handleDelete = async (type, id) => {
        const typeName = type === 'genre' ? 'Thể loại' : 'Chủ đề';
        if (!window.confirm(`Bạn có chắc muốn xóa ${typeName} này không? Các phim đang liên kết có thể bị ảnh hưởng!`)) return;

        try {
            if (type === 'genre') {
                await adminApi.deleteGenre(id);
            } else {
                await adminApi.deleteTopic(id);
            }
            toast.success("Xóa thành công!");
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa! Có thể do khóa ngoại (foreign key).");
        }
    };

    // --- RENDER BẢNG (Dùng chung cho cả Genre và Topic để code gọn hơn) ---
    const renderTable = (data, type) => {
        const title = type === 'genre' ? 'Thể loại (Genres)' : 'Chủ đề (Topics)';
        
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    <button 
                        onClick={() => openModal(type, 'add')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1"
                    >
                        <span>+ Thêm mới</span>
                    </button>
                </div>
                
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white sticky top-0 shadow-sm z-10 text-gray-600 text-sm border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold w-16">ID</th>
                                <th className="px-4 py-3 font-semibold">Tên</th>
                                <th className="px-4 py-3 font-semibold text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="3" className="text-center py-6 text-gray-500">Đang tải...</td></tr>
                            ) : data.length > 0 ? (
                                data.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-gray-500">#{item.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => openModal(type, 'edit', item)}
                                                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium mr-3"
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(type, item.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center py-6 text-gray-500">Chưa có dữ liệu</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 relative">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Cấu hình Danh mục</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý các Thể loại và Chủ đề cho hệ thống phim.</p>
            </div>

            {/* MAIN CONTENT: 2 Cột */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {renderTable(genres, 'genre')}
                {renderTable(topics, 'topic')}
            </div>

            {/* MODAL THÊM / SỬA */}
            {modalConfig.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {modalConfig.action === 'add' ? 'Thêm mới ' : 'Sửa '}
                            {modalConfig.type === 'genre' ? 'Thể loại' : 'Chủ đề'}
                        </h2>
                        
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                                <input 
                                    type="text" 
                                    value={modalConfig.name} 
                                    onChange={(e) => setModalConfig({...modalConfig, name: e.target.value})}
                                    required
                                    placeholder="Nhập tên..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSaving} 
                                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition disabled:opacity-50"
                                >
                                    {isSaving ? 'Đang lưu...' : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGenreTopic;