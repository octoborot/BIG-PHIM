const prisma = require('../config/prisma');
const { appError } = require('../utils/appError');

// GET UNLOCKED ACCOUNTS
const getUnlockedAccountsService = async () => {
    return await prisma.account.findMany({
        where: { is_locked: false },
        include: {
            profile: true,
            role: true
        }
    });
};

// GET STATS
const getAdminStatsService = async () => {
    const [totalMovies, totalUsers, lockedUsers] = await Promise.all([
        prisma.movie.count(),
        prisma.account.count({
            where: { is_deleted: false, role_id: 2 }
        }),
        prisma.account.count({
            where: { is_locked: true }
        })
    ]);

    return {
        totalMovies,
        totalUsers,
        lockedUsers
    };
};

// GET RECENT USERS
const getRecentUsersService = async () => {
    return await prisma.account.findMany({
        where: {
            is_deleted: false,
            role_id: 2
        },
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
            profile: {
                select: { display_name: true }
            }
        }
    });
};

// TOGGLE LOCK USER
const toggleUserLockService = async (currentUser, accountId, body) => {
    const id = parseInt(accountId);
    const { is_locked, lock_reason } = body;

    if (currentUser.accountId === id) {
        throw new appError('Bạn không thể tự khóa chính mình!', 400);
    }
    console.log("accountId raw:", accountId);
    console.log("parsed id:", id);

    const user = await prisma.account.findUnique({
        where: { id }
    });

    if (!user) {
        throw new appError('Không tìm thấy tài khoản!', 404);
    }

    if (user.role_id === 1) {
        throw new appError('Không thể khóa Admin!', 403);
    }

    let updateData = {
        is_locked,
        updated_at: new Date()
    };

    if (is_locked) {
        if (!lock_reason) {
            throw new appError('Vui lòng nhập lý do khóa!', 400);
        }

        updateData.lock_reason = lock_reason;
        updateData.lock_number = user.lock_number + 1;
    } else {
        updateData.lock_reason = null;
    }

    await prisma.account.update({
        where: { id },
        data: updateData
    });

    return {
        message: is_locked
            ? 'Đã khóa tài khoản!'
            : 'Đã mở khóa tài khoản!'
    };
};

module.exports = {
    getUnlockedAccountsService,
    getAdminStatsService,
    getRecentUsersService,
    toggleUserLockService
};