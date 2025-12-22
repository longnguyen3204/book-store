const db = require("../config/db");

class User {
  // Hàm tìm user bằng email
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0]; // Trả về user đầu tiên tìm thấy, hoặc undefined nếu không có
  }

  // Hàm tạo user mới
  static async create(userInfo) {
    const { role_id, fullname, email, password, phone_number } = userInfo;
    const sql = `INSERT INTO users (role_id, fullname, email, password, phone_number) VALUES (?, ?, ?, ?, ?)`;

    // Thực thi lệnh insert
    const [result] = await db.query(sql, [
      role_id,
      fullname,
      email,
      password,
      phone_number || null, // Xử lý null ngay tại đây hoặc truyền từ controller
    ]);

    return result;
  }

  // 3. Tìm user theo ID (Dùng cho xem Profile - vì Token lưu ID chứ không lưu email)
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  // 4. Cập nhật thông tin cá nhân (Không đụng đến password/email)
  static async updateProfile(id, data) {
    const { fullname, phone_number, address, avatar } = data;
    const sql = `UPDATE users SET fullname = ?, phone_number = ?, address = ?, avatar = ? WHERE id = ?`;
    await db.query(sql, [fullname, phone_number, address, avatar, id]);
  }

  // 5. Cập nhật mật khẩu riêng biệt
  static async updatePassword(id, newPassword) {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    await db.query(sql, [newPassword, id]);
  }

  static async getAllUsers() {
    const sql = `
      SELECT 
        u.id, 
        u.role_id, 
        u.fullname, 
        u.email, 
        u.phone_number, 
        u.address, 
        u.avatar, 
        u.is_locked,
        COUNT(o.id) as total_orders 
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'completed'
      GROUP BY u.id
      ORDER BY u.id DESC
    `;

    const [rows] = await db.query(sql);
    return rows;
  }

  // 7. Khóa hoặc Mở khóa user
  static async updateLockStatus(id, status) {
    const sql = "UPDATE users SET is_locked = ? WHERE id = ?";
    const [result] = await db.query(sql, [status, id]);
    return result;
  }

  static async updateRole(id, role_id) {
    const sql = "UPDATE users SET role_id = ? WHERE id = ?";
    const [result] = await db.query(sql, [role_id, id]);
    return result;
  }
}
module.exports = User;
