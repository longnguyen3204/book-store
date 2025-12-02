const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // 1. Lấy token từ header (Frontend gửi lên dạng: "Bearer <token>")
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Lấy phần chuỗi token phía sau chữ Bearer

    if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập! (Thiếu Token)" });
    }

    try {
        // 2. Giải mã token để lấy thông tin user (id, role_id)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_tam_thoi');
        
        // 3. Gán thông tin user vào biến req để Controller dùng
        req.user = decoded; 
        
        // 4. Cho phép đi tiếp
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

module.exports = authMiddleware;