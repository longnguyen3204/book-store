// 1. Khai báo thư viện
require("dotenv").config(); // Nạp biến môi trường từ .env
const express = require("express");
const cors = require("cors");
const path = require("path");

// 2. Khởi tạo ứng dụng Express
const app = express();

// 3. Cấu hình (Middleware)
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Để server đọc được dữ liệu JSON (quan trọng khi Login/Register)

// 4. Kết nối Database
const db = require("./src/config/db");

// --- TEST KẾT NỐI POOL ---
db.getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully (Pool mode)!");
    connection.release(); // Trả kết nối lại cho bể
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
// ------------------------------------------
// 5. KHAI BÁO CÁC ROUTES (ĐƯỜNG DẪN API)

app.use("/api/auth", require("./src/routes/authRoutes")); // Đường dẫn cho Auth (Đăng ký/Đăng nhập)
app.use("/api/users", require("./src/routes/userRoutes")); // Đường dẫn cho User(Đổi mk, thông tin tài khoản)
app.use("/api/books", require("./src/routes/bookRoutes")); // Đường dẫn cho Sách
app.use("/api/categories", require("./src/routes/categoryRoutes")); // Đường dẫn cho Thể loại
app.use("/api/cart", require("./src/routes/cartRoutes")); // Đường dẫn cho Giỏ hàng
app.use("/api/orders", require("./src/routes/orderRoutes")); // Đường dẫn cho Đơn hàng
app.use("/api/authors", require("./src/routes/authorRoutes")); // Đường dẫn cho Tác giả
app.use("/api/vouchers", require("./src/routes/voucherRoutes"));
app.use("/api/reviews", require("./src/routes/reviewsRoutes"));
app.use("/api/banner", require("./src/routes/bannerRoutes"));
app.use("/api/statistics", require("./src/routes/statisticsRoutes"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 6. Tạo đường dẫn test (Route gốc)
app.get("/", (req, res) => {
  res.send("<h1>Chào mừng! Server Backend Sách đang chạy ổn định.</h1>");
});

// 7. Chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`-------------------------------------------`);
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`-------------------------------------------`);
});
