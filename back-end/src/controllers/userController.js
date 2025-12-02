const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. Xem hồ sơ cá nhân
exports.getProfile = async (req, res) => {
    try {
        // req.user.id có được nhờ authMiddleware
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

        // Loại bỏ mật khẩu trước khi trả về
        const { password, ...userWithoutPass } = user;
        res.json(userWithoutPass);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 2. Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
    try {
        const { fullname, phone_number, address, avatar } = req.body;
        
        await User.updateProfile(req.user.id, { fullname, phone_number, address, avatar });
        
        res.json({ message: "Cập nhật hồ sơ thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 3. Đổi mật khẩu
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Lấy thông tin user hiện tại để lấy mật khẩu cũ trong DB
        const user = await User.findById(userId);

        // Kiểm tra mật khẩu cũ nhập vào có đúng không
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng!" });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Lưu vào DB
        await User.updatePassword(userId, hashedPassword);

        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};