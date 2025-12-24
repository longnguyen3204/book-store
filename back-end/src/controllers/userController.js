const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 1. Xem hồ sơ cá nhân
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Đảm bảo lấy đầy đủ các trường từ Database trả về
    const {
      id,
      role_id,
      fullname,
      email,
      phone_number,
      address,
      avatar,
      is_locked,
    } = user;

    res.json({
      id,
      role_id,
      fullname,
      email,
      phone_number,
      address: address || "", // Trả về chuỗi rỗng nếu null để tránh lỗi Frontend
      avatar,
      is_locked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { fullname, phone_number, address, avatar } = req.body;

    await User.updateProfile(req.user.id, {
      fullname,
      phone_number,
      address,
      avatar,
    });

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

//  Lấy danh sách tất cả user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách user thành công",
      data: users, // Trả về mảng user
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lấy danh sách user",
    });
  }
};

//  Khóa hoặc Mở khóa tài khoản
exports.updateLockStatus = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID user từ URL
    const { status } = req.body; // Lấy trạng thái từ body (1: khóa, 0: mở)

    // Kiểm tra dữ liệu đầu vào
    if (status !== 0 && status !== 1) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ (chỉ nhận 0 hoặc 1)",
      });
    }

    // Gọi hàm từ Model
    await User.updateLockStatus(id, status);

    return res.status(200).json({
      success: true,
      message:
        status === 1
          ? "Đã khóa tài khoản thành công"
          : "Đã mở khóa tài khoản thành công",
    });
  } catch (error) {
    console.error("Error locking user:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái",
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    // Kiểm tra đầu vào
    if (!role_id) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp role_id mới",
      });
    }

    // Gọi hàm updateRole từ Model User
    const result = await User.updateRole(id, role_id);

    // Kiểm tra xem có dòng nào được cập nhật không (check affectedRows)
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng hoặc không có thay đổi",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cập nhật quyền người dùng thành công",
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật quyền",
      error: error.message,
    });
  }
};
