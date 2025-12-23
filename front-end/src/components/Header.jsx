import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { brandAssets } from "../data/content";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { cart } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const cartCount = cart.reduce(
    (sum, item) => sum + (item.quantity ? Number(item.quantity) : 1),
    0
  );

  return (
    <div id="header-wrap">
      <div className="top-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              <Link to="/" className="main-logo">
                <img src={brandAssets.logo} alt="logo" />
              </Link>
            </div>
            <div className="col-md-6">
              <div
                className="right-element"
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {user ? (
                  <Link
                    to="/profile"
                    className="user-account for-buy"
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <i className="icon icon-user"></i>
                    <span>{user.fullname || user.email}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="user-account for-buy">
                    <i className="icon icon-user"></i>
                    <span>Account</span>
                  </Link>
                )}

                <Link
                  to="/order-history"
                  className="order-history for-buy"
                  style={{ display: "flex", gap: 6, alignItems: "center" }}
                >
                  <i className="icon icon-list"></i>
                  <span>Lịch sử</span>
                </Link>

                <Link
                  to="/cart"
                  className="cart for-buy"
                  style={{ display: "flex", gap: 6, alignItems: "center" }}
                >
                  <i className="icon icon-clipboard"></i>
                  <span>Cart:({cartCount})</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
