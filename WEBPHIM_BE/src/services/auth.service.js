const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { appError } = require('../utils/appError');
const { isValidEmail } = require('../utils/validators');

// REGISTER
const registerService = async ({ email, password, display_name }) => {
    const existing = await prisma.account.findUnique({ where: { email } });
    if (existing) {
        throw new appError('Email đã tồn tại!', 400);
    }

    const role = await prisma.role.findUnique({ where: { name: 'User' } });

    const hashed = await bcrypt.hash(password, 10);

    const account = await prisma.account.create({
        data: {
            email,
            password: hashed,
            role_id: role.id,
            profile: {
                create: {
                    display_name: display_name || 'Người dùng mới'
                }
            }
        },
        include: { profile: true }
    });

    account.password = undefined;

    return account;
};

// LOGIN
const loginService = async ({ email, password }) => {
    const account = await prisma.account.findUnique({
        where: { email },
        include: { profile: true, role: true }
    });

    if (!account) {
        throw new appError('Sai email hoặc mật khẩu!', 401);
    }

    if (account.is_locked || account.is_deleted) {
        throw new appError('Tài khoản bị khóa!', 403);
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
        throw new appError('Sai mật khẩu!', 401);
    }

    const roleName = account.role?.name?.toUpperCase() || 'USER';

    const token = jwt.sign(
        {
            accountId: account.id,
            role: roleName,
            profileId: account.profile?.id || null
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
            issuer: 'webphim-api',
            audience: 'webphim-client'
        }
    );

    return {
        token,
        user: {
            id: account.id,
            email: account.email,
            role: roleName,
            profile: account.profile
                ? {
                    id: account.profile.id,
                    name: account.profile.name
                }
                : null
        }
    };
};

// CHANGE PASSWORD
const changePasswordService = async (accountId, body) => {
    const { oldPassword, newPassword, confirmPassword } = body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new appError('Thiếu dữ liệu!', 400);
    }

    if (newPassword !== confirmPassword) {
        throw new appError('Xác nhận mật khẩu sai!', 400);
    }

    const account = await prisma.account.findUnique({
        where: { id: accountId }
    });

    const match = await bcrypt.compare(oldPassword, account.password);
    if (!match) {
        throw new appError('Mật khẩu cũ sai!', 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.account.update({
        where: { id: accountId },
        data: { password: hashed }
    });

    return true;
};

module.exports = {
    registerService,
    loginService,
    changePasswordService
};