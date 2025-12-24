import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { LeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import userApi from "../../api/userApi";
import "./ForgotPass.css";

export default function ForgotPass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSendPin = async () => {
    if (!email) return message.warning("Vui lòng nhập email trước");
    setSending(true);
    try {
      await userApi.sendResetPin({ email });
      message.success("Mã PIN đã được gửi! Kiểm tra console server.");
    } catch (error) {
      message.error("Không thể gửi mã. Vui lòng kiểm tra lại email.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyPin = async () => {
    if (!pin) return message.warning("Vui lòng nhập mã PIN");
    setLoading(true);
    try {
      await userApi.verifyPin({ email, pin });
      setIsVerified(true);
      message.success("Xác thực thành công!");
    } catch (error) {
      message.error("Mã PIN không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return message.error("Mật khẩu xác nhận không khớp!");
    }
    setLoading(true);
    try {
      await userApi.resetPassword({
        email,
        pin,
        newPassword: passwordData.newPassword,
      });
      message.success("Đổi mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-wrapper">
            <span className="brand-logo">📖</span>
            <span className="brand-text">BOOKSAW</span>
          </div>
          <h2 className="auth-title text-center">Quên Mật Khẩu</h2>
          <p className="auth-subtitle">
            {isVerified ? "Đặt mật khẩu mới" : "Đặt lại mật khẩu bằng Email"}
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={
            isVerified ? handleResetPassword : (e) => e.preventDefault()
          }
        >
          {/* HÀNG EMAIL + NÚT GỬI MÃ */}
          <div className="input-group">
            <label>Địa chỉ Email</label>
            <div className="input-row">
              <input
                type="email"
                placeholder="example@gmail.com"
                disabled={isVerified}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {!isVerified && (
              <button
                type="button"
                className="btn-side-action"
                onClick={handleSendPin}
                disabled={sending}
              >
                {sending ? <Spin size="small" /> : "GỬI MÃ"}
              </button>
            )}
          </div>

          {/* HÀNG MÃ PIN (NẰM DƯỚI EMAIL) */}
          <div className="input-group">
            <label>Mã PIN xác thực</label>
            <div className="input-row">
              <input
                type="text"
                placeholder="Mã 6 số từ server"
                disabled={isVerified}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
              {isVerified && <CheckCircleOutlined className="verified-icon" />}
            </div>
          </div>

          {/* NÚT XÁC NHẬN MÃ (ẨN ĐI KHI ĐÃ XÁC THỰC) */}
          {!isVerified && (
            <button
              type="button"
              className="btn-main-action"
              onClick={handleVerifyPin}
              disabled={loading}
            >
              {loading ? <Spin /> : "XÁC NHẬN MÃ"}
            </button>
          )}

          {/* PHẦN NHẬP MẬT KHẨU MỚI (HIỆN KHI ĐÃ XÁC THỰC) */}
          {isVerified && (
            <div className="password-reveal-section">
              <div className="input-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-main-action"
                disabled={loading}
              >
                {loading ? <Spin /> : "ĐẶT LẠI MẬT KHẨU"}
              </button>
            </div>
          )}
        </form>

        <div className="auth-footer">
          <Link to="/login" className="back-link">
            <LeftOutlined /> Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
