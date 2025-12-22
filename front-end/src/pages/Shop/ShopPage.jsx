import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { allBooks } from "../../data/content.js"; // Import dữ liệu tổng hợp
import "./shop.css";
import { useCart } from "../../context/CartContext";
import Header from "../../components/Header.jsx";
const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Lấy hàm thêm vào giỏ hàng từ Context
  const { addToCart } = useCart(); 

  const filteredBooks = allBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (book) => {
    addToCart(book);
    // Bạn có thể thêm thông báo nhanh ở đây
    alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };
  return (
    <div className="shop-page">
        <Header />
      {/* Banner đầu trang */}
      <section className="py-5 bg-light mb-5">
        <div className="container text-center">
          <h3 className="section-title">Library</h3>
          
        </div>
      </section>

<div className="container">
        <div className="row g-4">
          {filteredBooks.map((book) => (
            <div className="col-md-3 col-sm-6" key={book.id}>
              <div className="product-item">
                <figure className="product-style">
                  <img src={book.image} alt={book.title} className="product-item img-fluid" />
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
                  <h3 className="fs-6 text-uppercase">{book.title}</h3>
                  <span className="text-muted d-block small">{book.author}</span>
                  <div className="item-price text-danger fw-bold">{book.price}</div>
                </figcaption>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;