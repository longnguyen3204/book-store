front-end/
│
├── public/                   # Chứa file tĩnh (index.html, favicon, images gốc)
│
├── src/
│   ├── api/                  # Nơi chứa các hàm gọi API sang Backend
│   │   ├── axiosClient.js    # Cấu hình chung (BaseURL, Token...)
│   │   ├── authApi.js        # Các API login, register
│   │   ├── bookApi.js        # Các API lấy sách, thêm/sửa/xóa sách
│   │   ├── cartApi.js        # API giỏ hàng
│   │   └── userApi.js        # API profile
│   │
│   ├── assets/               # Chứa ảnh, fonts, file CSS riêng
│   │   ├── images/
│   │   └── css/
│   │
│   ├── components/           # Các thành phần UI dùng chung (nhỏ)
│   │   ├── Header.jsx        # Thanh menu (Navbar)
│   │   ├── Footer.jsx        # Chân trang
│   │   ├── ProductCard.jsx   # Thẻ hiển thị 1 cuốn sách
│   │   ├── Loading.jsx       # Vòng quay loading
│   │   └── ProtectedRoute.jsx # Chặn người chưa đăng nhập
│   │
│   ├── context/              # Quản lý trạng thái toàn cục (Global State)
│   │   └── AuthContext.js    # Lưu thông tin User đã đăng nhập chưa
│   │
│   ├── layouts/              # Các bộ khung giao diện
│   │   ├── MainLayout.jsx    # Khung cho khách (có Header + Footer)
│   │   └── AdminLayout.jsx   # Khung cho Admin (có Sidebar quản trị)
│   │
│   ├── pages/                # Các trang màn hình chính (To)
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── Client/           # Trang cho khách mua
│   │   │   ├── HomePage.jsx
│   │   │   ├── BookDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   │
│   │   └── Admin/            # Trang cho quản trị viên
│   │       ├── Dashboard.jsx
│   │       ├── ManageBooks.jsx
│   │       └── ManageOrders.jsx
│   │
│   ├── App.jsx               # Nơi định nghĩa Routing (đường dẫn)
│   └── main.jsx              # File khởi chạy React (Entry point)
│
├── .env                      # Lưu biến môi trường (REACT_APP_API_URL...)
└── package.json              # Khai báo thư viện