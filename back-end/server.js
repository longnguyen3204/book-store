// 1. Khai báo thư viện
require('dotenv').config(); // Nạp biến môi trường từ .env
const express = require('express');
const cors = require('cors');

// 2. Khởi tạo ứng dụng Express
const app = express();

// 3. Cấu hình (Middleware)
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Để server đọc được dữ liệu JSON (quan trọng khi Login/Register)

// 4. Kết nối Database
const db = require('./src/config/db'); 

// --- TEST KẾT NỐI POOL ---
db.getConnection()
    .then(connection => {
        console.log("✅ Database connected successfully (Pool mode)!");
        connection.release(); // Trả kết nối lại cho bể
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err.message);
    });
// ------------------------------------------

// 5. KHAI BÁO CÁC ROUTES (ĐƯỜNG DẪN API)

// Đường dẫn cho Auth (Đăng ký/Đăng nhập)
// Khi ai đó vào /api/auth... thì chuyển sang authRoutes xử lý
app.use('/api/auth', require('./src/routes/authRoutes'));

// Đường dẫn cho User(Đổi mk, thông tin tài khoản)
app.use('/api/users', require('./src/routes/userRoutes'));

// Đường dẫn cho Sách
app.use('/api/books', require('./src/routes/bookRoutes'));


// 6. Tạo đường dẫn test (Route gốc)
app.get('/', (req, res) => {
    res.send("<h1>Chào mừng! Server Backend Sách đang chạy ổn định.</h1>");
});

// 7. Chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`-------------------------------------------`);
});