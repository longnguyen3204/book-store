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
}
module.exports = User;