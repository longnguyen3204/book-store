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
      <div className="top-content py-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* LOGO */}
            <div className="col-md-6 d-flex align-items-center">
              <Link to="/" className="main-logo d-block">
                <img
                  src="/logo.jpg"
                  alt="logo"
                  className="img-fluid"
                  style={{
                    width: "120px",
                    borderRadius: "8px",
                  }}
                />
              </Link>
            </div>

            {/* RIGHT MENU */}
            <div className="col-md-6">
              <div className="d-flex justify-content-end align-items-center gap-3">
                {user ? (
                  <Link
                    to="/profile"
                    className="user-account for-buy d-flex align-items-center gap-2 "
                    style={{ fontSize: "25px" }}
                  >
                    <i
                      className="icon icon-user"
                      style={{ fontSize: "25px" }}
                    ></i>
                    <span>{user.fullname || user.email}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="user-account for-buy d-flex align-items-center gap-2"
                  >
                    <i className="icon icon-user"></i>
                    <span>Account</span>
                  </Link>
                )}

                <Link
                  to="/order-history"
                  className="order-history for-buy d-flex align-items-center gap-2"
                >
                  <i className="icon icon-list"></i>
                  <span>Lịch sử</span>
                </Link>

                <Link
                  to="/cart"
                  className="cart for-buy d-flex align-items-center gap-2"
                >
                  <i className="icon icon-clipboard"></i>
                  <span>Cart ({cartCount})</span>
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
