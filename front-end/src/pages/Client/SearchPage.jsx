import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HomeHeader from "../../components/HomeHeader";
import { listProduct } from "../../config/ProductRequest";

function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [books, setBooks] = useState([]);

  useEffect(() => {
    listProduct().then(setBooks);
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, books]);

  return (
    <div className="app">
      <HomeHeader searchQuery={query} />

      <section className="py-5 mt-40">
        <div className="container">
          <div className="section-header align-center mb-5">
            <h2 className="section-title">Kết quả tìm kiếm cho: "{query}"</h2>
            <p className="text-muted">
              {filteredResults.length} sản phẩm được tìm thấy
            </p>
          </div>

          <div className="product-list">
            <div className="row">
              {filteredResults.length > 0 ? (
                filteredResults.map((book) => (
                  <div className="col-md-3 mb-4" key={book.id}>
                    <div className="product-item">
                      <figure className="product-style">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="product-item"
                        />
                        <Link
                          to={`/books/${book.id}`}
                          className="add-to-cart"
                        >
                          Xem chi tiết
                        </Link>
                      </figure>
                      <figcaption>
                        <h3>{book.title}</h3>
                        <span>{book.author}</span>
                        <div className="item-price">
                          {book.prevPrice && (
                            <span className="prev-price">{book.prevPrice}</span>
                          )}
                          {book.price}
                        </div>
                      </figcaption>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-20">
                  <i className="icon icon-search text-5xl opacity-20 block mb-4"></i>
                  <h3>Rất tiếc, không tìm thấy sản phẩm nào phù hợp.</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchPage;