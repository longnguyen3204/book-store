import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { login as loginApi } from "../../api/authApi";

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

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const result = await loginApi({ email, password });
      let targetPath = "/";
      if (onLogin) {
        targetPath = (await onLogin(result)) || "/";
      } else {
        if (result?.token) localStorage.setItem("token", result.token);
        if (result?.user)
          localStorage.setItem("user", JSON.stringify(result.user));
        targetPath = result?.user?.role_id === 1 ? "/admin" : "/";
      }

      setSuccess("Đăng nhập thành công! Đang chuyển trang...");
      setTimeout(() => navigate(targetPath), 800);
    } catch (err) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-mark">
            <BookIcon />
            <span className="brand-name">BOOKSAW</span>
          </div>
          <h1 className="title">Đăng Nhập</h1>
        </div>

        {success && <div className="success-text">{success}</div>}
        {error && <div className="error-text">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your.email@example.com"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="form-label" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="helper-row">
            <a href="/forgot_password" className="link">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="footer-text">
          Don&apos;t have an account?{" "}
          <a href="/register" className="link">
            Đăng Ký
          </a>
        </div>
      </div>
    </div>
  );
}
