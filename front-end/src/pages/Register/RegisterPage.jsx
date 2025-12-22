import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../../api/authApi";
import "./RegisterPage.css";

const BookIcon = () => (
  <svg className="book-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4.5 4.75A2.25 2.25 0 0 1 6.75 2.5h10.5A2.25 2.25 0 0 1 19.5 4.75v14a.75.75 0 0 1-1.1.66l-2.9-1.61-2.9 1.61a.75.75 0 0 1-.72 0l-2.9-1.61-2.9 1.61A.75.75 0 0 1 4.5 18.75z"
      fill="#b36c4d"
      stroke="#b36c4d"
      strokeWidth="1"
    />
  </svg>
);

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, password, confirmPassword } = formData;

    if (!fullname || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      setIsLoading(true);
      await authApi.register({ 
        fullname: formData.fullname, // Khớp với Backend
        email: formData.email, 
        password: formData.password 
          });

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const message =
        err?.message ||
        err.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="login-header">
          <div className="brand-mark">
            <span className="book-icon" aria-hidden="true">📚</span>
            <span className="brand-name">BOOKSAW</span>
          </div>
          <h2 className="register-title">Đăng Ký</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-label" htmlFor="name">Họ và tên</label>
          <input
            type="text"
            id="name"
            name="fullname"
            className="form-control"
            placeholder="Nhập họ tên của bạn"
            value={formData.fullname}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="confirmPassword">Nhập lại mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </button>
        </form>

        <div className="auth-redirect">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
