import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import "../pages/Admin/Admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    /* Sử dụng class sidebar-closed để đẩy nội dung ra khi đóng */
    <div
      className={`admin-wrapper ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      } ${isSidebarOpen ? "sidebar-mobile-open" : ""}`}
    >
      {/* 1. SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>ADMIN PANEL</h3>
          {/* Nút đóng nhanh cho mobile nằm bên trong sidebar */}
          <button className="mobile-close-btn" onClick={toggleSidebar}>
            <CloseOutlined />
          </button>
        </div>

        <nav className="admin-nav">
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
        {/* THANH TOP HEADER - NƠI CHỨA NÚT MENU BẠN CẦN */}
        <header className="admin-top-header">
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            <MenuOutlined />
          </button>
          <h2 className="admin-title">Quản trị hệ thống</h2>
        </header>

        {/* NỘI DUNG TRANG */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* BACKDROP CHO MOBILE */}
      <div className="admin-backdrop" onClick={toggleSidebar}></div>
    </div>
  );
};

export default AdminLayout;
