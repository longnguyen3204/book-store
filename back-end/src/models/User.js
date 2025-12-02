const db = require('../config/db');

class User {
    // Hàm tìm user bằng email
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
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
            phone_number || null // Xử lý null ngay tại đây hoặc truyền từ controller
        ]);
        
        return result;
    }

    // 3. Tìm user theo ID (Dùng cho xem Profile - vì Token lưu ID chứ không lưu email)
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
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
        const sql = 'UPDATE users SET password = ? WHERE id = ?';
        await db.query(sql, [newPassword, id]);
    }
}
module.exports = User;