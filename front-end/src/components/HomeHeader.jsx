import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Dropdown, message, Input } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DownOutlined,
  FacebookFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import logo from "../assets/images/main-logo.png";
import "./HomeHeader.css";
import { useCart } from "../pages/Cart/CartContext";

function HomeHeader() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(null);
  const { cart } = useCart();

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      if (!stored) {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.warn("Invalid user data in storage, clearing.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.info("Đã đăng xuất");
    navigate("/login");
  };

  const goHistory = () => navigate("/order-history");

  const userMenuItems = [
    { key: "1", label: "Tài khoản", onClick: () => navigate("/profile") },
    { key: "2", label: "Đơn hàng", onClick: () => navigate("/orders") },
    { key: "3", label: "Đăng xuất", onClick: handleLogout },
  ];

  return (
    <header className="fixed top-0 z-10 w-full">
      <div className="bg-[#f3f2ec] flex flex-row items-center justify-between gap-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="social-links">
            <ul>
              <li>
                <a href="#">
                  <i className="icon icon-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="icon icon-youtube-play"></i>
                </a>
              </li>
            </ul>
          </div>

          <div className="header-actions">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <div className="account">
                  <UserOutlined />
                  <span>{user.fullname || user.email || "Account"}</span>
                  <DownOutlined />
                </div>
              </Dropdown>
            ) : (
              <Link to="/login" className="account">
                <UserOutlined />
                <span>Account</span>
              </Link>
            )}

            <Link to="/order-history" className="order-history-link">
              <span>Lịch sử</span>
            </Link>

            <Link to="/cart" className="cart">
              <Badge count={cart.length} size="small" offset={[5, 0]}>
                <ShoppingCartOutlined />
              </Badge>
              <span>Giỏ hàng: ({cart.length})</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#f3f2ec] py-2 border-b border-gray-200">
        <div className="container mx-auto px-4 flex flex-col items-center gap-5">
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
          <form className="w-full max-w-xl" onSubmit={handleSearch}>
            <Input
              prefix={
                <span className="history-link-prefix" onClick={goHistory}>
                  Lịch sử đơn
                </span>
              }
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
