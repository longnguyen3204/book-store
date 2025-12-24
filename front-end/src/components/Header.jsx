import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../pages/Cart/CartContext";
import "./Header.css";

const Header = () => {
  const { cart } = useCart();
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [location]); // Cập nhật lại khi chuyển trang

  const cartCount = cart.reduce(
    (sum, item) => sum + (item.quantity ? Number(item.quantity) : 1),
    0
  );

  return (
    <header className="main-header shadow-sm">
      <div className="container-fluid px-4">
        <div className="header-wrapper d-flex justify-content-between align-items-center py-2">
          {/* Cánh trái: Logo */}
          <div className="header-left">
            <Link
              to="/"
              className="main-logo d-flex align-items-center text-decoration-none"
            >
              <img src="/logo.jpg" alt="logo" className="logo-img" />
              <span className="brand-name ms-2 d-none d-sm-inline">
                BOOKSAW
              </span>
            </Link>
          </div>

          {/* Cánh phải: Menu */}
          <div className="header-right">
            <nav className="header-menu d-flex align-items-center gap-4">
              {/* User Account */}
              {user ? (
                <Link to="/profile" className="menu-item user-info">
                  <i className="icon icon-user me-2"></i>
                  <span className="user-name">
                    {user.fullname || user.email}
                  </span>
                </Link>
              ) : (
                <Link to="/login" className="menu-item">
                  <i className="icon icon-user me-2"></i>
                  <span>Đăng nhập</span>
                </Link>
              )}

              {/* Order History */}
              <Link to="/order-history" className="menu-item">
                <i className="icon icon-list me-2"></i>
                <span className="d-none d-md-inline">Lịch sử</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="menu-item cart-btn">
                <div className="position-relative">
                  <i className="icon icon-clipboard me-2"></i>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </div>
                <span className="d-none d-md-inline">Giỏ hàng</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
