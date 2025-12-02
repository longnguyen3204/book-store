const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- 1. ĐĂNG KÝ TÀI KHOẢN ---
exports.register = async (req, res) => {
    try {
        // Lấy dữ liệu từ Frontend gửi lên
        const { fullname, email, password, phone_number } = req.body;

        // 1. Kiểm tra các trường bắt buộc
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập họ tên, email và mật khẩu!" });
        }

        // 2. Kiểm tra xem email đã tồn tại trong DB chưa
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email này đã được sử dụng!" });
        }

        // 3. Mã hóa mật khẩu (Hashing)
        // salt là chuỗi ngẫu nhiên để tăng độ khó khi hack
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Mặc định quyền là Customer (role_id = 2)
        // (Lưu ý: Đảm bảo trong bảng roles, id=2 là 'customer')
        const role_id = 2;

        // 5. Lưu vào Database
        await User.create({
            role_id,
            fullname,
            email,
            password: hashedPassword,
            phone_number
        });

        res.status(201).json({ message: "Đăng ký tài khoản thành công!" });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi Server khi đăng ký" });
    }
};

// --- 2. ĐĂNG NHẬP ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate đầu vào
        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập Email và Mật khẩu" });
        }

        // 2. Tìm user trong Database theo email
        const user = await User.findByEmail(email);

        // Nếu không tìm thấy user
        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
        }

        // 3. So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
        }

        // 4. Kiểm tra tài khoản có bị khóa không (cột is_locked)
        if (user.is_locked) {
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
        }

        // 5. Tạo Token (Vé thông hành)
        const token = jwt.sign(
            { id: user.id, role_id: user.role_id }, // Dữ liệu gói trong token
            process.env.JWT_SECRET || 'secret_key_tam_thoi', // Khóa bí mật
            { expiresIn: '1d' } // Token hết hạn sau 1 ngày
        );

        // 6. Trả về kết quả (Ẩn password đi, chỉ trả về thông tin cần thiết)
        res.status(200).json({
            message: "Đăng nhập thành công",
            token: token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role_id: user.role_id,
                phone_number: user.phone_number,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi Server khi đăng nhập" });
    }
};