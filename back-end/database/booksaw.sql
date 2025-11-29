-- Tạo Database và thiết lập bảng mã tiếng Việt
CREATE DATABASE IF NOT EXISTS bookstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE booksaw;

-- ==========================================
-- 1. NHÓM NGƯỜI DÙNG & PHÂN QUYỀN
-- ==========================================

-- Bảng Quyền (Admin, Customer)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- VD: 'admin', 'customer'
    description VARCHAR(255)
);

-- Bảng Người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL, -- Lưu hash password
    address TEXT,
    avatar VARCHAR(255),            -- Link ảnh đại diện
    is_locked BOOLEAN DEFAULT FALSE, -- Khóa tài khoản (True = khóa)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ==========================================
-- 2. NHÓM SẢN PHẨM (SÁCH & DANH MỤC)
-- ==========================================

-- Bảng Nhà xuất bản
CREATE TABLE publishers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    email VARCHAR(100)
);

-- Bảng Tác giả
CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT -- Tiểu sử tác giả
);

-- Bảng Thể loại
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Bảng Sách (Thông tin chính)
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_id INT,
    name VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    description TEXT,
    original_price DECIMAL(10, 2) NOT NULL, -- Giá gốc (gạch ngang)
    price DECIMAL(10, 2) NOT NULL,          -- Giá bán thực tế
    quantity INT DEFAULT 0,                 -- Số lượng tồn kho
    sold_count INT DEFAULT 0,               -- Số lượng đã bán
    view_count INT DEFAULT 0,               -- Lượt xem
    publish_year INT,
    language VARCHAR(50),
    weight DECIMAL(5, 2),                   -- Trọng lượng
    size VARCHAR(50),                       -- Kích thước
    page_count INT,
    is_active BOOLEAN DEFAULT TRUE,         -- Ẩn/Hiện sách
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
);

-- Bảng trung gian: Sách - Tác giả (1 sách có thể nhiều tác giả)
CREATE TABLE book_authors (
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Bảng trung gian: Sách - Thể loại (1 sách có thể thuộc nhiều thể loại)
CREATE TABLE book_categories (
    book_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (book_id, category_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Bảng Hình ảnh sách (1 sách nhiều ảnh)
CREATE TABLE book_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE, -- Đánh dấu ảnh bìa chính
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. NHÓM MARKETING (BANNER & VOUCHER)
-- ==========================================

-- Bảng Banner quảng cáo
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),          -- Bấm vào thì nhảy đi đâu
    display_order INT DEFAULT 0,    -- Thứ tự hiển thị
    is_active BOOLEAN DEFAULT TRUE  -- Ẩn/Hiện
);

-- Bảng Mã giảm giá
CREATE TABLE vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,    -- Mã nhập (VD: SALE50)
    discount_type ENUM('percent', 'fixed') NOT NULL, -- Giảm theo % hay số tiền
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0, -- Đơn tối thiểu để dùng
    quantity INT DEFAULT 100,            -- Số lượng mã phát hành
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

-- ==========================================
-- 4. NHÓM ĐƠN HÀNG & ĐÁNH GIÁ
-- ==========================================

-- Bảng Phương thức thanh toán
CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- COD, Banking, Momo...
    description TEXT
);

-- Bảng Đơn hàng (Tổng quát)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    payment_method_id INT,
    voucher_id INT NULL,                 -- Có thể null nếu không dùng voucher
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL, -- Tổng tiền cuối cùng
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,       -- Địa chỉ giao hàng
    note TEXT,                            -- Ghi chú của khách
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

-- Bảng Chi tiết đơn hàng (Mua sách gì, giá bao nhiêu)
CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Lưu giá tại thời điểm mua (quan trọng)
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Bảng Đánh giá & Bình luận
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- 1 đến 5 sao
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_visible BOOLEAN DEFAULT TRUE, -- Admin có thể ẩn comment xấu
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);