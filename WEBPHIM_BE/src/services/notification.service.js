const prisma = require('../config/prisma');
const {appError} = require('../utils/appError');

const getNotificationService = async (profileId) => {
    const notifications = await prisma.notification.findMany({
        where: {profile_id: profileId},
        orderBy: { created_at: 'desc' },
        take: 20
    });

    const unreadCount = await prisma.notification.count({
        where: {
            profile_id: profileId,
            is_read: false
        }
    });

    return {
        notifications,
        unreadCount
    };
};

const maskAsReadService = async (profileId, notificationId) => {
    const result = await prisma.notification.updateMany({
        where: {
            id: notificationId,
            profileId: profileId
        },
        data: {
            isRead: true
        }
    });
    if(result.count === 0) {
        throw new appError('Không tìm thấy hoặc không có quyền', 404);
    }
    return true;
};

module.exports = {
    getNotificationService,
    maskAsReadService
};