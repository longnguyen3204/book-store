import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import "./shop.css";
import { useCart } from "../Cart/CartContext";
import { getBooks } from "../../api/bookApi";
import defaultAuthor from "../../assets/images/default.png";

const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isSearchOpen, setSearchOpen] = useState(false);
  // Lấy hàm thêm vào giỏ hàng từ Context
  const { cart, addToCart } = useCart();
  const cartCount = cart.reduce(
    (sum, item) => sum + (item.quantity ? Number(item.quantity) : 1),
    0
  );

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
  }, []);
  // Lấy sách từ API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getBooks();
        const normalized = (data || []).map((item) => ({
          id: item.id,
          title: item.name || item.title || "Đang cập nhật",
          author: item.author || "Đang cập nhật",
          price: item.price ?? item.original_price ?? 0,
          image: item.image || defaultAuthor,
        }));
        setBooks(normalized);
      } catch (err) {
        setError(err.message || "Không tải được danh sách sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    (book.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };
  const toggleSearch = (event) => {
    event.preventDefault();
    setSearchOpen((open) => !open);
  };
  const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") return "Liên hệ";
    const number = Number(value);
    return Number.isNaN(number)
      ? value
      : number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };
  return (
    <div className="shop-page">
      <div id="header-wrap" className={isSearchOpen ? "show" : ""}>
        <div className="top-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 d-flex align-items-center">
                <Link
                  to="/"
                  className="main-logo"
                  style={{ width: "50px", height: "50px" }}
                >
                  <img src="./logo.jpg" alt="logo" />
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
      {/* Banner đầu trang */}
      <section className="py-5 bg-light mb-5">
        <div className="container text-center">
          <h3 className="section-title">Kho sách</h3>
          <div className="d-flex justify-content-center mt-3">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Tìm kiếm theo tên sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container">
        {loading && <p className="text-center">Đang tải sách...</p>}
        {error && !loading && (
          <p className="text-center text-danger">{error}</p>
        )}
        {!loading && !error && (
          <>
            {filteredBooks.length === 0 ? (
              <p className="text-center">Không tìm thấy sách phù hợp.</p>
            ) : (
              <div className="row g-4">
                {filteredBooks.map((book) => (
                  <div className="col-md-3 col-sm-6" key={book.id}>
                    <div className="product-item">
                      <figure className="product-style">
                        <Link to={`/books/${book.id}`}>
                          <img
                            src={book.image}
                            alt={book.title}
                            className="product-item img-fluid"
                          />
                        </Link>
                        {/* Gọi hàm handleAddToCart khi nhấn nút */}
                        <button
                          type="button"
                          className="add-to-cart"
                          onClick={() => handleAddToCart(book)}
                        >
                          Add to Cart
                        </button>
                      </figure>
                      <figcaption className="text-center mt-3">
                        <Link
                          to={`/books/${book.id}`}
                          className="text-decoration-none text-dark"
                        >
                          <h3 className="fs-6 text-uppercase">{book.title}</h3>
                        </Link>
                        <span className="text-muted d-block small">
                          {book.author}
                        </span>
                        <div className="item-price text-danger fw-bold">
                          {formatPrice(book.price)}
                        </div>
                      </figcaption>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
