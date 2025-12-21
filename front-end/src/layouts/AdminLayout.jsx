// src/components/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../pages/Admin/Admin.css"; // Import file CSS vừa tạo

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Hàm kiểm tra link active
  const isActive = (path) => (location.pathname.includes(path) ? "active" : "");

  return (
    <div className="admin-container">
      {/* Sidebar Styled */}
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link
            to="/admin/books"
            className={`admin-nav-link ${isActive("/books")}`}
          >
            Sách
          </Link>
          <Link
            to="/admin/categories"
            className={`admin-nav-link ${isActive("/categories")}`}
          >
            Danh mục
          </Link>
          <Link
            to="/admin/orders"
            className={`admin-nav-link ${isActive("/orders")}`}
          >
            Đơn hàng
          </Link>
          <Link
            to="/admin/users"
            className={`admin-nav-link ${isActive("/users")}`}
          >
            Người dùng
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-danger"
          style={{ marginTop: "3rem", width: "100%" }}
        >
          Đăng xuất
        </button>
      </div>

      {/* Main Content Styled */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
