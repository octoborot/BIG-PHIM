const prisma = require('../config/prisma');
const { appError } = require('../utils/appError');

// GET ALL PROFILES
const getAllProfileService = async () => {
    return await prisma.profile.findMany({
        include: {
            account: {
                select: {
                    email: true,
                    is_active: true,
                    is_locked: true,
                    role_id: true
                }
            }
        }
    });
};

const genderMap = {
    "Nam": "Nam",
    "Nữ": "Nu",
    "Không xác định": "Kh_ng_x_c___nh"
};

// GET PROFILE BY ACCOUNT ID
const getProfileByAccountIdService = async (accountId) => {
    const id = parseInt(accountId);

    if (!accountId || isNaN(id)) {
        throw new appError('ID không hợp lệ!', 400);
    }

    const profile = await prisma.profile.findUnique({
        where: { account_id: id },
        include: {
            account: {
                select: { email: true, role: true }
            }
        }
    });

    if (!profile) {
        throw new appError('Không tìm thấy hồ sơ!', 404);
    }

    return profile;
};

// CREATE PROFILE
const createProfileService = async ({ display_name, gender, avatar_url, account_id }) => {
    const id = parseInt(account_id);

    if (!account_id || isNaN(id)) {
        throw new appError('Account ID không hợp lệ!', 400);
    }

    const existingProfile = await prisma.profile.findUnique({
        where: { account_id: id }
    });

    if (existingProfile) {
        throw new appError('Tài khoản này đã có Profile!', 400);
    }

    return await prisma.profile.create({
        data: {
            display_name,
            gender: gender || 'Không xác định',
            avatar_url: avatar_url || 'linkk',
            account_id: id
        }
    });
};

// TOGGLE LOCK ACCOUNT
const toggleLockAccountService = async (accountId, { is_locked, lock_reason }) => {
    const id = parseInt(accountId);

    if (!accountId || isNaN(id)) {
        throw new appError('ID không hợp lệ!', 400);
    }

    const account = await prisma.account.findUnique({
        where: { id }
    });

    if (!account) {
        throw new appError('Không tìm thấy tài khoản!', 404);
    }

    if (account.role_id === 1) {
        throw new appError('Không thể khóa Admin!', 403);
    }

    const updateData = {
        is_locked,
        updated_at: new Date()
    };

    if (is_locked) {
        if (!lock_reason) {
            throw new appError('Vui lòng nhập lý do khóa!', 400);
        }

        updateData.lock_reason = lock_reason;
        updateData.lock_number = account.lock_number + 1;
    } else {
        updateData.lock_reason = null;
    }

    return await prisma.account.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            email: true,
            is_locked: true,
            lock_reason: true,
            lock_number: true
        }
    });
};

// UPDATE MY PROFILE
const updateMyProfileService = async (accountId, data) => {
    const id = parseInt(accountId);

    if (!accountId || isNaN(id)) {
        throw new appError('ID không hợp lệ!', 400);
    }

    try {
        const updated = await prisma.profile.update({
            where: { account_id: id },
            data: {
                ...data,
                updated_at: new Date()
            }
        });

        return updated;

    } catch (error) {
        console.log("🔥 Prisma error:", error); // 👈 THÊM DÒNG NÀY

        if (error.code === 'P2025') {
            throw new appError('Không tìm thấy profile để cập nhật!', 404);
        }

        throw new appError('Lỗi cập nhật profile!', 500);
    }
};

module.exports = {
    getAllProfileService,
    getProfileByAccountIdService,
    createProfileService,
    toggleLockAccountService,
    updateMyProfileService
};