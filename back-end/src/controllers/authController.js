const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// --- 1. ĐĂNG KÝ TÀI KHOẢN ---
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, phone_number } = req.body;

    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập họ tên, email và mật khẩu!" });
    }

    const user = await User.findByEmail(email);
    if (user) {
      return res.status(409).json({ message: "Email này đã được sử dụng!" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role_id = 2; // Khách hàng mặc định role =2

    await User.create({
      role_id,
      fullname,
      email,
      password: hashedPassword,
      phone_number,
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

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập Email và Mật khẩu" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    if (user.is_locked) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
    }

    //  Tạo Token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET || "secret_key_tam_thoi",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role_id: user.role_id,
        phone_number: user.phone_number,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi Server khi đăng nhập" });
  }
};
