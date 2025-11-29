backend-bookstore/
│
├── database/                 # Lưu CSDL
├── node_modules/             # Thư viện tải về (không đụng vào)
├── src/                      # Source code chính nằm ở đây
│   ├── config/               # Cấu hình hệ thống
│   │   └── db.js             # Kết nối MySQL (nơi điền host, user, pass)
│   │
│   ├── controllers/          # Xử lý logic nghiệp vụ (nhận request, trả response)
│   │   ├── authController.js       # Đăng ký, đăng nhập
│   │   ├── bookController.js       # Thêm/sửa/xóa sách, tìm kiếm
│   │   ├── orderController.js      # Đặt hàng, xử lý thanh toán
│   │   ├── categoryController.js   # Quản lý thể loại
│   │   ├── bannerController.js     # Quản lý banner (Mới)
│   │   └── voucherController.js    # Quản lý mã giảm giá
│   │
│   ├── models/               # Nơi chứa các câu lệnh SQL (Tương tác trực tiếp DB)
│   │   ├── User.js           # Chứa các hàm: createUser, findByEmail...
│   │   ├── Book.js           # Chứa: getAllBooks, getBookById...
│   │   ├── Order.js          # Chứa: createOrder, getOrderDetails...
│   │   └── Banner.js         # Các lệnh SQL liên quan bảng banners
│   │
│   ├── routes/               # Định nghĩa đường dẫn API (Endpoints)
│   │   ├── authRoutes.js     # /api/auth/login, /api/auth/register
│   │   ├── bookRoutes.js     # /api/books
│   │   ├── orderRoutes.js    # /api/orders
│   │   └── index.js          # File gom tất cả routes lại
│   │
│   ├── middlewares/          # Các hàm kiểm tra trung gian
│   │   ├── authMiddleware.js # Kiểm tra user đã đăng nhập chưa (JWT)
│   │   ├── roleMiddleware.js # Kiểm tra có phải Admin không
│   │   └── upload.js         # Cấu hình Multer để upload ảnh sách/banner
│   │
│   └── utils/                # Các hàm tiện ích dùng chung
│       └── emailService.js   # Gửi email xác nhận đơn hàng (nếu có)
│
├── uploads/                  # Nơi lưu ảnh sách, banner sau khi upload
├── .env                      # Lưu biến môi trường (DB password, JWT secret)
├── .gitignore                # File để git bỏ qua node_modules, .env
├── package.json              # Khai báo thư viện (express, mysql2, nodemon...)
└── server.js                 # File chạy chính (Entry point)