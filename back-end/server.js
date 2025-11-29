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
// Chỉ cần gọi file db.js vào, đoạn code db.connect() bên trong đó sẽ tự chạy
const db = require('./src/config/db'); 

// 5. Tạo đường dẫn test (Route)
// Để vào trình duyệt gõ localhost:3000 xem server sống hay chết
app.get('/', (req, res) => {
    res.send("<h1>Chào mừng! Server Backend Sách đang chạy ổn định.</h1>");
});

// 6. Chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`-------------------------------------------`);
});