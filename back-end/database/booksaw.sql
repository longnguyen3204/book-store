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
    image_url VARCHAR(255) NOT NULL,
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
    is_activity BOOLEAN DEFAULT TRUE
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
    description TEXT,
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

-- Giỏ hàng (1 user 1 giỏ, chứa nhiều item)
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_cart_book (cart_id, book_id),
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

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
    status ENUM('pending', 'processing', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
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
-- 1. NHÓM NGƯỜI DÙNG & PHÂN QUYỀN
-- ==========================================

INSERT INTO roles (name, description) VALUES 
('admin', 'Quản trị hệ thống'),
('customer', 'Khách hàng mua sắm'),
('staff', 'Nhân viên kho'),
('editor', 'Biên tập viên nội dung'),
('moderator', 'Người kiểm duyệt bình luận'),
('support', 'Hỗ trợ khách hàng'),
('manager', 'Quản lý cửa hàng'),
('guest', 'Khách vãng lai'),
('marketing', 'Nhân viên marketing'),
('vip', 'Khách hàng thân thiết');

INSERT INTO users (role_id, fullname, email, phone_number, password, address, avatar, image_url) VALUES 
(1, 'Nguyễn Văn Admin', 'admin@booksaw.com', '0901234567', 'hash_pass_1', 'Hà Nội', 'avt1.jpg', 'img1.jpg'),
(2, 'Trần Thị Khách', 'khach1@gmail.com', '0912345678', 'hash_pass_2', 'TP.HCM', 'avt2.jpg', 'img2.jpg'),
(2, 'Lê Văn Nam', 'namle@gmail.com', '0923456789', 'hash_pass_3', 'Đà Nẵng', 'avt3.jpg', 'img3.jpg'),
(2, 'Phạm Thị Hoa', 'hoapham@gmail.com', '0934567890', 'hash_pass_4', 'Cần Thơ', 'avt4.jpg', 'img4.jpg'),
(3, 'Hoàng Văn Kho', 'khohoang@booksaw.com', '0945678901', 'hash_pass_5', 'Hải Phòng', 'avt5.jpg', 'img5.jpg'),
(2, 'Đặng Văn Bình', 'binhdang@gmail.com', '0956789012', 'hash_pass_6', 'Huế', 'avt6.jpg', 'img6.jpg'),
(2, 'Bùi Thị Lan', 'lanbui@gmail.com', '0967890123', 'hash_pass_7', 'Nha Trang', 'avt7.jpg', 'img7.jpg'),
(7, 'Lý Quản Lý', 'lymanager@booksaw.com', '0978901234', 'hash_pass_8', 'Hà Nội', 'avt8.jpg', 'img8.jpg'),
(2, 'Vũ Văn Hùng', 'hungvu@gmail.com', '0989012345', 'hash_pass_9', 'Bình Dương', 'avt9.jpg', 'img9.jpg'),
(10, 'Ngô VIP', 'ngovip@gmail.com', '0990123456', 'hash_pass_10', 'Vũng Tàu', 'avt10.jpg', 'img10.jpg');

-- ==========================================
-- 2. NHÓM SẢN PHẨM (SÁCH & DANH MỤC)
-- ==========================================

INSERT INTO publishers (name, address, email) VALUES 
('NXB Trẻ', 'Hồ Chí Minh', 'nxbtr@tre.com.vn'),
('NXB Kim Đồng', 'Hà Nội', 'info@kimdong.com.vn'),
('NXB Giáo Dục', 'Hà Nội', 'contact@nxbgd.vn'),
('NXB Phụ Nữ', 'Hà Nội', 'nxbphunu@gmail.com'),
('NXB Nhã Nam', 'Hà Nội', 'book@nhanam.vn'),
('NXB Tổng Hợp', 'TP.HCM', 'nxbth@tphcm.gov.vn'),
('NXB Văn Học', 'Hà Nội', 'nxbvanhoc@vnn.vn'),
('NXB Lao Động', 'Hà Nội', 'nxblaodong@gmail.com'),
('NXB Tri Thức', 'Hà Nội', 'trithuc@nxb.vn'),
('NXB Thế Giới', 'Hà Nội', 'thegioi@nxb.vn');

INSERT INTO authors (name, bio) VALUES 
('Nguyễn Nhật Ánh', 'Nhà văn chuyên viết cho thanh thiếu niên'),
('Nam Cao', 'Nhà văn hiện thực xuất sắc'),
('Tô Hoài', 'Tác giả Dế Mèn Phiêu Lưu Ký'),
('Haruki Murakami', 'Nhà văn nổi tiếng Nhật Bản'),
('Dale Carnegie', 'Tác giả Đắc Nhân Tâm'),
('J.K. Rowling', 'Tác giả Harry Potter'),
('Paulo Coelho', 'Tác giả Nhà Giả Kim'),
('Xuân Quỳnh', 'Nữ thi sĩ nổi tiếng'),
('Hàn Mặc Tử', 'Nhà thơ tài năng bạc mệnh'),
('Ngô Tất Tố', 'Tác giả Tắt Đèn');

INSERT INTO categories (name, description) VALUES 
('Văn học', 'Các tác phẩm văn học trong và ngoài nước'),
('Kinh tế', 'Sách về quản trị, kinh doanh'),
('Kỹ năng sống', 'Phát triển bản thân, kỹ năng mềm'),
('Thiếu nhi', 'Truyện tranh, truyện cổ tích'),
('Ngoại ngữ', 'Sách học tiếng Anh, Trung, Nhật'),
('Khoa học', 'Kiến thức khoa học kỹ thuật'),
('Lịch sử', 'Lịch sử Việt Nam và thế giới'),
('Tâm lý', 'Sách phân tích tâm lý con người'),
('Nấu ăn', 'Hướng dẫn ẩm thực'),
('Giáo khoa', 'Sách phục vụ học tập nhà trường');

INSERT INTO books (publisher_id, name, isbn, description, original_price, price, quantity, sold_count, view_count, publish_year, language, weight, size, page_count) VALUES 
(1, 'Mắt Biếc', '978123', 'Truyện dài của Nguyễn Nhật Ánh', 120000, 95000, 100, 50, 1000, 2019, 'Tiếng Việt', 0.5, '13x20', 300),
(5, 'Nhà Giả Kim', '978456', 'Hành trình đi tìm vận mệnh', 80, 69000, 200, 150, 5000, 2020, 'Tiếng Việt', 0.3, '13x20', 200),
(5, 'Rừng Na Uy', '978789', 'Tác phẩm của Murakami', 150000, 135000, 50, 20, 800, 2018, 'Tiếng Việt', 0.4, '14x21', 450),
(2, 'Dế Mèn Phiêu Lưu Ký', '978001', 'Truyện thiếu nhi kinh điển', 60000, 45000, 300, 200, 3000, 2021, 'Tiếng Việt', 0.2, '13x19', 150),
(8, 'Đắc Nhân Tâm', '978002', 'Sách kỹ năng hay nhất', 90000, 75000, 500, 450, 10000, 2022, 'Tiếng Việt', 0.4, '14x20', 320),
(1, 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', '978003', 'Ký ức tuổi thơ', 110000, 88000, 150, 80, 2500, 2017, 'Tiếng Việt', 0.3, '13x20', 250),
(10, 'Harry Potter Tập 1', '978004', 'Phù thủy và pháp sư', 250000, 220000, 100, 90, 4000, 2015, 'Tiếng Việt', 0.7, '15x23', 400),
(3, 'Toán Lớp 1', '978005', 'Sách giáo khoa tiểu học', 20000, 20000, 1000, 900, 15000, 2023, 'Tiếng Việt', 0.2, '17x24', 80),
(4, 'Tắt Đèn', '978006', 'Phê phán xã hội cũ', 55000, 40000, 60, 30, 1200, 2010, 'Tiếng Việt', 0.3, '13x19', 180),
(7, 'Số Đỏ', '978007', 'Tiểu thuyết trào phúng', 75000, 60000, 80, 45, 1800, 2012, 'Tiếng Việt', 0.3, '13x20', 220);

INSERT INTO book_authors (book_id, author_id) VALUES 
(1, 1), (2, 7), (3, 4), (4, 3), (5, 5), (6, 1), (7, 6), (8, 3), (9, 10), (10, 2);

INSERT INTO book_categories (book_id, category_id) VALUES 
(1, 1), (2, 3), (3, 1), (4, 4), (5, 3), (6, 1), (7, 4), (8, 10), (9, 1), (10, 1);

INSERT INTO book_images (book_id, image_url, is_thumbnail) VALUES 
(1, 'matbiec.jpg', TRUE), (2, 'nhagiakim.jpg', TRUE), (3, 'rungnauy.jpg', TRUE), (4, 'demen.jpg', TRUE), (5, 'dacnhantam.jpg', TRUE),
(6, 'tuoitho.jpg', TRUE), (7, 'hp1.jpg', TRUE), (8, 'toan1.jpg', TRUE), (9, 'tatden.jpg', TRUE), (10, 'sodo.jpg', TRUE);

-- ==========================================
-- 3. NHÓM MARKETING (BANNER & VOUCHER)
-- ==========================================

INSERT INTO banners (title, description, image_url, link_url, display_order) VALUES 
('Sale Hè', 'Giảm giá 50%', 'banner1.jpg', '/sale', 1),
('Sách Mới', 'Ra mắt sách mới', 'banner2.jpg', '/new', 2),
('Combo Hot', 'Mua 2 tặng 1', 'banner3.jpg', '/combo', 3),
('Thiếu Nhi', 'Thế giới cho bé', 'banner4.jpg', '/kids', 4),
('Flash Sale', 'Chỉ hôm nay', 'banner5.jpg', '/flash', 5),
('Tác giả mới', 'Giao lưu tác giả', 'banner6.jpg', '/event', 6),
('App Member', 'Tải app nhận quà', 'banner7.jpg', '/app', 7),
('Tết Sale', 'Quà tết ý nghĩa', 'banner8.jpg', '/tet', 8),
('Giảm 20k', 'Cho đơn đầu tiên', 'banner9.jpg', '/first', 9),
('Free Ship', 'Đơn từ 200k', 'banner10.jpg', '/ship', 10);

INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, quantity, start_date, end_date) VALUES 
('GIAY10', 'percent', 10, 100000, 100, '2025-01-01', '2025-12-31'),
('GIAM50K', 'fixed', 50000, 500000, 50, '2025-01-01', '2025-06-01'),
('NEWBIE', 'percent', 20, 0, 1000, '2025-01-01', '2025-12-31'),
('HESANG', 'percent', 15, 200000, 200, '2025-05-01', '2025-08-31'),
('TET2025', 'fixed', 100000, 1000000, 30, '2025-01-01', '2025-02-15'),
('FREESHIP', 'fixed', 30000, 150000, 500, '2025-01-01', '2025-12-31'),
('VIP10', 'percent', 30, 0, 100, '2025-01-01', '2025-12-31'),
('SACHHAY', 'percent', 5, 50000, 300, '2025-01-01', '2025-12-31'),
('LASTDAY', 'percent', 40, 300000, 20, '2025-12-30', '2025-12-31'),
('BOOKSAW', 'fixed', 25000, 200000, 100, '2025-01-01', '2025-12-31');

-- ==========================================
-- 4. NHÓM ĐƠN HÀNG & ĐÁNH GIÁ
-- ==========================================

INSERT INTO carts (user_id) VALUES 
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

INSERT INTO cart_items (cart_id, book_id, quantity) VALUES 
(1, 1, 2), (2, 2, 1), (3, 3, 1), (4, 4, 5), (5, 5, 1),
(6, 6, 2), (7, 7, 1), (8, 8, 3), (9, 9, 1), (10, 10, 1);

INSERT INTO payment_methods (name, description) VALUES 
('COD', 'Thanh toán khi nhận hàng'),
('Banking', 'Chuyển khoản ngân hàng'),
('Momo', 'Ví điện tử Momo'),
('ZaloPay', 'Ví điện tử ZaloPay'),
('ShopeePay', 'Ví điện tử ShopeePay'),
('VNPay', 'Cổng thanh toán VNPay'),
('Visa', 'Thẻ tín dụng Visa'),
('MasterCard', 'Thẻ tín dụng MasterCard'),
('Paypal', 'Thanh toán quốc tế'),
('Cash', 'Tiền mặt tại quầy');

INSERT INTO orders (user_id, payment_method_id, voucher_id, total_amount, status, shipping_address) VALUES 
(2, 1, 1, 150000, 'completed', 'TP.HCM'),
(3, 2, NULL, 300000, 'processing', 'Hà Nội'),
(4, 3, 3, 250000, 'pending', 'Đà Nẵng'),
(6, 1, NULL, 90000, 'cancelled', 'Cần Thơ'),
(7, 2, 2, 450000, 'shipping', 'Hải Phòng'),
(9, 3, NULL, 120000, 'completed', 'Huế'),
(10, 1, NULL, 600000, 'completed', 'Vũng Tàu'),
(2, 6, 6, 220000, 'completed', 'TP.HCM'),
(3, 5, NULL, 85000, 'pending', 'Hà Nội'),
(4, 1, NULL, 135000, 'completed', 'Đà Nẵng');

INSERT INTO order_details (order_id, book_id, quantity, price) VALUES 
(1, 1, 1, 95000), (1, 2, 1, 69000), (2, 3, 2, 135000), (3, 5, 3, 75000), (4, 4, 2, 45000),
(5, 7, 2, 220000), (6, 6, 1, 88000), (7, 10, 10, 60000), (8, 9, 5, 40000), (9, 8, 4, 20000);

INSERT INTO reviews (user_id, book_id, rating, comment) VALUES 
(2, 1, 5, 'Sách rất hay, giao nhanh'),
(3, 1, 4, 'Nội dung cảm động'),
(4, 2, 5, 'Rất ý nghĩa'),
(6, 3, 3, 'Hơi khó hiểu'),
(7, 4, 5, 'Tuổi thơ ùa về'),
(9, 5, 4, 'Sách bổ ích'),
(10, 7, 5, 'Fan Harry Potter không nên bỏ qua'),
(2, 8, 2, 'Sách hơi cũ'),
(3, 10, 5, 'Tuyệt vời'),
(4, 9, 4, 'Chất lượng giấy tốt');