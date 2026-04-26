const profileService = require('../services/profile.service');

// 1. GET ALL PROFILES
const getAllProfiles = async (req, res) => {
    try {
        const profiles = await profileService.getAllProfileService();
        res.status(200).json({ success: true, data: profiles });
    } catch (error) {
        res.status(error.starusCode || 500).json({ success: false, message: error.message });
    }
};

// 2. GET PROFILE BY ACCOUNT ID
const getProfileByAccountId = async (req, res) => {
    try {
        const accountId = req.user.accountId || req.user.id;

        const profile = await profileService.getProfileByAccountIdService(accountId);

        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

// 3. CREATE PROFILE
const createProfile = async (req, res) => {
    try {
        const newProfile = await profileService.createProfileService(req.body);

        res.status(201).json({
            success: true,
            message: "Tạo profile thành công!",
            data: newProfile
        });
    } catch (error) {
        if (error instanceof appError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(error.starusCode || 500).json({ success: false, message: error.message });
    }
};

// 4. TOGGLE LOCK ACCOUNT
const toggleLockAccount = async (req, res) => {
    try {
        const accountId = req.params.id;

        if (!accountId || isNaN(accountId)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ!' });
        }

        const result = await profileService.toggleLockAccountService(accountId, req.body);

        res.status(200).json({
            success: true,
            message: req.body.is_locked
                ? "Đã khóa tài khoản!"
                : "Đã mở khóa tài khoản!",
            data: result
        });
    } catch (error) {
        if (error instanceof appError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(error.starusCode || 500).json({ success: false, message: error.message });
    }
};

// 5. UPDATE MY PROFILE
const updateMyProfile = async (req, res) => {
    try {
        const accountId = req.user.accountId || req.user.id;
        const updatedProfile = await profileService.updateMyProfileService(accountId, req.body);
        console.log("BODY:", req.body);
        res.status(200).json({
            success: true,
            message: "Cập nhật hồ sơ thành công!",
            data: updatedProfile
        });
    } catch (error) {
        if (error instanceof appError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(error.starusCode || 500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllProfiles,
    getProfileByAccountId,
    createProfile,
    toggleLockAccount,
    updateMyProfile
};