const { getNotificationService, maskAsReadService } = require('../services/notification.service');

const getNotifications = async (req, res) => {
    try {
        const profileId = req.user.profileId;
        const result = await getNotificationService(profileId);
        res.json({
            success: true,
            unread_count: result.unreadCount,
            data: result.notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const profileId = req.user.profileId;
        const notificationId = parseInt(req.params.id);
        await maskAsReadService(profileId, notificationId);        
        res.json({ success: true, message: 'Đã đánh dấu đọc thông báo!' });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};


module.exports = {
    getNotifications,
    markAsRead
};