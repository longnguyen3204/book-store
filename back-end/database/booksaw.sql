-- Tạo Database và thiết lập bảng mã tiếng Việt
CREATE DATABASE IF NOT EXISTS booksaw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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

-- ==========================================
-- 5. DỮ LIỆU MẪU (INSERT DATA)
-- ==========================================

-- 1. Thêm Quyền (Roles)
INSERT INTO roles (id, name, description) VALUES 
(1, 'admin', 'Quản trị viên toàn quyền'),
(2, 'customer', 'Khách hàng mua sách');

-- 2. Thêm Người dùng (Users)
-- Mật khẩu ở đây là hash của chuỗi: "123456"
INSERT INTO users (role_id, fullname, email, password, phone_number, address) VALUES 
(1, 'Admin Quản Trị', 'admin@gmail.com', '$2a$10$X.X.X.PLACEHOLDER.HASH.FOR.123456', '0901234567', 'Hà Nội'),
(2, 'Nguyễn Văn Khách', 'khach@gmail.com', '$2a$10$X.X.X.PLACEHOLDER.HASH.FOR.123456', '0987654321', 'TP. Hồ Chí Minh');

-- 3. Thêm Nhà xuất bản (Publishers)
INSERT INTO publishers (id, name, address, email) VALUES 
(1, 'NXB Trẻ', '161B Lý Chính Thắng, TP.HCM', 'info@nxbtre.com.vn'),
(2, 'NXB Kim Đồng', '55 Quang Trung, Hà Nội', 'info@nxbkimdong.com.vn'),
(3, 'Nhã Nam', '59 Đỗ Quang, Hà Nội', 'info@nhanam.vn');

-- 4. Thêm Tác giả (Authors)
INSERT INTO authors (id, name, bio) VALUES 
(1, 'Nguyễn Nhật Ánh', 'Nhà văn chuyên viết cho thanh thiếu niên.'),
(2, 'J.K. Rowling', 'Tác giả bộ truyện Harry Potter nổi tiếng.'),
(3, 'Rosie Nguyễn', 'Tác giả sách kỹ năng, phong cách sống.'),
(4, 'Paulo Coelho', 'Tiểu thuyết gia nổi tiếng người Brazil.');

-- 5. Thêm Thể loại (Categories)
INSERT INTO categories (id, name, description) VALUES 
(1, 'Văn học', 'Các tác phẩm văn học trong và ngoài nước'),
(2, 'Thiếu nhi', 'Sách dành cho lứa tuổi thiếu nhi'),
(3, 'Kỹ năng sống', 'Sách phát triển bản thân'),
(4, 'Kinh tế', 'Sách về kinh doanh và làm giàu');

-- 6. Thêm Sách (Books)
INSERT INTO books (id, publisher_id, name, isbn, description, original_price, price, quantity, sold_count, publish_year, page_count) VALUES 
(1, 1, 'Mắt Biếc', '978604100001', 'Một tác phẩm kinh điển về tình yêu đơn phương.', 110000, 88000, 100, 25, 2019, 300),
(2, 2, 'Harry Potter và Hòn Đá Phù Thủy', '978604100002', 'Tập đầu tiên trong series Harry Potter.', 150000, 120000, 50, 10, 2000, 400),
(3, 3, 'Tuổi Trẻ Đáng Giá Bao Nhiêu', '978604100003', 'Cuốn sách gối đầu giường của người trẻ.', 80000, 60000, 200, 150, 2016, 250),
(4, 3, 'Nhà Giả Kim', '978604100004', 'Hành trình đi tìm kho báu của chàng chăn cừu.', 79000, 55000, 80, 40, 1988, 220);

-- 7. Liên kết Sách - Tác giả (Book_Authors)
INSERT INTO book_authors (book_id, author_id) VALUES 
(1, 1), -- Mắt Biếc - Nguyễn Nhật Ánh
(2, 2), -- Harry Potter - J.K. Rowling
(3, 3), -- Tuổi Trẻ... - Rosie Nguyễn
(4, 4); -- Nhà Giả Kim - Paulo Coelho

-- 8. Liên kết Sách - Thể loại (Book_Categories)
INSERT INTO book_categories (book_id, category_id) VALUES 
(1, 1), (1, 3), -- Mắt Biếc thuộc Văn học & Kỹ năng (VD thế)
(2, 1), (2, 2), -- Harry Potter thuộc Văn học & Thiếu nhi
(3, 3),
(4, 1);

-- 9. Thêm Ảnh sách (Book_Images)
-- (Đây là link ảnh giả định, bạn có thể thay bằng link thật trên mạng)
INSERT INTO book_images (book_id, image_url, is_thumbnail) VALUES 
(1, 'https://upload.wikimedia.org/wikipedia/vi/thumb/a/a8/Mat_biec.jpg/220px-Mat_biec.jpg', TRUE),
(2, 'https://upload.wikimedia.org/wikipedia/vi/a/a9/Harry_Potter_va_Hon_da_Phu_thuy.jpg', TRUE),
(3, 'https://cdn0.fahasa.com/media/catalog/product/t/u/tuoi-tre-dang-gia-bao-nhieu-u.jpg', TRUE),
(4, 'https://cdn0.fahasa.com/media/catalog/product/n/h/nha-gia-kim.jpg', TRUE);

-- 10. Thêm Banner & Voucher
INSERT INTO banners (title, image_url, display_order) VALUES 
('Siêu Sale Tháng 11', 'https://example.com/banner1.jpg', 1),
('Sách Mới Về', 'https://example.com/banner2.jpg', 2);

INSERT INTO vouchers (code, discount_type, discount_value, min_order_value) VALUES 
('WELCOME', 'fixed', 20000, 100000), -- Giảm 20k cho đơn từ 100k
('SALE10', 'percent', 10, 200000);   -- Giảm 10% cho đơn từ 200k

-- 11. Thêm Phương thức thanh toán
INSERT INTO payment_methods (id, name, description) VALUES 
(1, 'COD', 'Thanh toán khi nhận hàng'),
(2, 'Banking', 'Chuyển khoản ngân hàng'),
(3, 'Momo', 'Ví điện tử Momo');

-- 12. Thêm Đơn hàng mẫu (Orders)
-- Khách hàng ID 2 mua hàng
INSERT INTO orders (id, user_id, payment_method_id, total_amount, status, shipping_address) VALUES 
(1, 2, 1, 140000, 'delivered', 'Số 10, Đường ABC, TP.HCM'), -- Đơn đã giao
(2, 2, 3, 120000, 'pending', 'Số 10, Đường ABC, TP.HCM');   -- Đơn đang chờ

-- 13. Thêm Chi tiết đơn hàng (Order_Details)
-- Đơn hàng 1 mua: Mắt Biếc (88k) + Nhà Giả Kim (55k) ~ 143k (giả sử voucher giảm còn 140k)
INSERT INTO order_details (order_id, book_id, quantity, price) VALUES 
(1, 1, 1, 88000),
(1, 4, 1, 55000),
(2, 2, 1, 120000); -- Đơn 2 mua Harry Potter

-- 14. Thêm Đánh giá (Reviews)
INSERT INTO reviews (user_id, book_id, rating, comment) VALUES 
(2, 1, 5, 'Sách rất hay, bìa đẹp, giao hàng nhanh!');