const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 1. Xem hồ sơ cá nhân
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

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
      address: address || "",
      avatar,
      is_locked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách user thành công",
      data: users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lấy danh sách user",
    });
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

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng!" });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updatePassword(userId, hashedPassword);

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đổi mật khẩu" });
  }
};
//  Khóa hoặc Mở khóa tài khoản
exports.updateLockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

    if (!role_id) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp role_id mới",
      });
    }

    const result = await User.updateRole(id, role_id);

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
let tempPinStore = {};

exports.sendResetPin = async (req, res) => {
  try {
    const { email } = req.body;

    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    tempPinStore[email] = pin;

    console.log(` MÃ PIN QUÊN MẬT KHẨU CHO: ${email}`);
    console.log(` MÃ PIN: [ ${pin} ]`);
    console.log("=".repeat(40) + "\n");

    res.json({ message: "Mã PIN đã được in ra " });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

exports.verifyPin = async (req, res) => {
  const { email, pin } = req.body;

  // Đối chiếu với mã PIN lưu trong biến tạm
  if (tempPinStore[email] === pin) {
    res.json({ success: true, message: "Mã PIN chính xác" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Mã PIN sai hoặc không tồn tại" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, pin, newPassword } = req.body; // Lấy thêm pin từ req.body

    // 1. Kiểm tra lại mã PIN trước khi cho phép đổi mật khẩu
    if (!tempPinStore[email] || tempPinStore[email] !== pin) {
      return res.status(400).json({
        message: "Phiên làm việc hết hạn hoặc mã PIN không hợp lệ!",
      });
    }
    // 2. Mã hóa mật khẩu mới trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Gọi Model để cập nhật mật khẩu vào Database theo Email
    const result = await User.updatePasswordByEmail(email, hashedPassword);

    if (result.affectedRows > 0) {
      // 4. Xóa mã PIN khỏi bộ nhớ tạm sau khi đổi thành công để bảo mật
      delete tempPinStore[email];

      return res.json({
        success: true,
        message:
          "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.",
      });
    } else {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
  } catch (error) {
    console.error("Lỗi reset password:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đặt lại mật khẩu" });
  }
};
