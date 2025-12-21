import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Dropdown, message, Input } from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DownOutlined,
  FacebookFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import logo from "../assets/images/main-logo.png"; //
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  // Giả lập dữ liệu người dùng
  const dataUser = null;
  const cartProducts = [];

  // Trong Header.jsx
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Chuyển hướng và đính kèm từ khóa vào URL
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
      // Nếu có state đóng mở thanh search thì đóng lại ở đây
    }
  };

  const userMenuItems = [
    { key: "1", label: "Tài khoản", onClick: () => navigate("/profile") },
    { key: "2", label: "Đơn hàng", onClick: () => navigate("/orders") },
    {
      key: "3",
      label: "Đăng xuất",
      onClick: () => message.info("Đã đăng xuất"),
    },
  ];

  return (
    <header className="fixed top-0 z-10 w-full">
      {/* TOPBAR: Social bên trái, Account/Cart bên phải */}
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
            {dataUser ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <div className="account">
                  <UserOutlined />
                  <span>Account</span>
                  <DownOutlined />
                </div>
              </Dropdown>
            ) : (
              <Link to="/login" className="account">
                <UserOutlined />
                <span>Account</span>
              </Link>
            )}

            <Link to="/cart" className="cart">
              <Badge count={cartProducts.length} size="small" offset={[5, 0]}>
                <ShoppingCartOutlined />
              </Badge>
              <span>Cart: ($0)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN HEADER: Logo & Search */}
      <div className="bg-[#f3f2ec] py-2 border-b border-gray-200">
        <div className="container mx-auto px-4 flex flex-col items-center gap-5">
          {/* Logo trung tâm - Bỏ chữ L2 Team */}
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
