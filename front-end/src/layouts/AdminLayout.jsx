import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined, CloseOutlined, HomeOutlined } from "@ant-design/icons"; // Thêm HomeOutlined
import "../pages/Admin/Admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role_id !== 1 && user.role_name !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`admin-wrapper ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      } ${isSidebarOpen ? "sidebar-mobile-open" : ""}`}
    >
      {/* 1. SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>ADMIN PANEL</h3>
          <button className="mobile-close-btn" onClick={toggleSidebar}>
            <CloseOutlined />
          </button>
        </div>

        <nav className="admin-nav">
          {/* PHẦN TRANG CHỦ MỚI THÊM */}
          <Link
            to="/"
            className="admin-nav-link home-link"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "10px",
              color: "#000000ff",
            }}
          >
            <HomeOutlined /> Trang chủ
          </Link>

          <Link
            to="/admin/books"
            className={`admin-nav-link ${isActive("/admin/books")}`}
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          >
            Sách
          </Link>
          <Link
            to="/admin/categories"
            className={`admin-nav-link ${isActive("/admin/categories")}`}
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          >
            Danh mục
          </Link>
          <Link
            to="/admin/orders"
            className={`admin-nav-link ${isActive("/admin/orders")}`}
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          >
            Đơn hàng
          </Link>
          <Link
            to="/admin/vouchers"
            className={`admin-nav-link ${isActive("/admin/vouchers")}`}
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          >
            Voucher
          </Link>
          <Link
            to="/admin/users"
            className={`admin-nav-link ${isActive("/admin/users")}`}
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          >
            Người dùng
          </Link>
        </nav>

        <button onClick={handleLogout} className="admin-logout-btn">
          ĐĂNG XUẤT
        </button>
      </aside>

      {/* 2. MAIN AREA */}
      <div className="admin-main">
        <header className="admin-top-header">
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            <MenuOutlined />
          </button>
          <h2 className="admin-title">Quản trị hệ thống</h2>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <div className="admin-backdrop" onClick={toggleSidebar}></div>
    </div>
  );
};

export default AdminLayout;
