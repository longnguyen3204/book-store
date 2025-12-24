import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import classNames from "classnames";
import AOS from "aos";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import statisticsApi from "../../api/statisticsApi";

const Arrow = ({ direction, onClick }) => (
  <button
    type="button"
    className={classNames(
      "slick-arrow",
      direction === "prev" ? "prev" : "next"
    )}
    onClick={onClick}
    aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
  >
    <i
      className={`icon icon-arrow-${direction === "prev" ? "left" : "right"}`}
    ></i>
  </button>
);

const ProductCard = ({
  id,
  title,
  author,
  price,
  image,
  original_price,
  onAdd,
}) => (
  <div className="product-item">
    <figure className="product-style">
      <img src={image} alt={title} className="product-item" />
      <button
        type="button"
        className="add-to-cart"
        onClick={() => onAdd({ id, title, author, price, image })}
      >
        Add to Cart
      </button>
    </figure>
    <figcaption>
      <h3>{title}</h3>
      <span>{author}</span>
      <div className="item-price">
        {original_price && original_price > price && (
          <span className="prev-price">
            {Number(original_price).toLocaleString()}đ
          </span>
        )}
        {Number(price).toLocaleString()}đ
      </div>
    </figcaption>
  </div>
);

const HomePage = ({ user }) => {
  // --- States lưu trữ dữ liệu API ---
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [popularBooksData, setPopularBooksData] = useState({});
  const [bestSelling, setBestSelling] = useState(null);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isSticky, setSticky] = useState(false);
  const { cart, addToCart } = useCart();

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (item.quantity ? Number(item.quantity) : 1),
        0
      ),
    [cart]
  );

  // --- Gọi API khi Mount ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [hero, featured, popular, best, offers] = await Promise.all([
          statisticsApi.getHeroSlides(),
          statisticsApi.getFeaturedBooks(),
          statisticsApi.getPopularBooks(),
          statisticsApi.getBestSellingBook(),
          statisticsApi.getSpecialOffers(),
        ]);

        setHeroSlides(hero);
        setFeaturedBooks(featured);
        setPopularBooksData(popular);
        setBestSelling(best);
        setSpecialOffers(offers);

        // Set tab mặc định là category đầu tiên nhận được
        const categories = Object.keys(popular);
        if (categories.length > 0) setActiveTab(categories[0]);
      } catch (error) {
        console.error("Lỗi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    AOS.init({ duration: 1200, once: true });
  }, []);

  // --- Logic phụ trợ (Scroll, Click...) ---
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };

  const heroSettings = useMemo(
    () => ({
      dots: true,
      arrows: true,
      fade: true,
      autoplay: true,
      prevArrow: <Arrow direction="prev" />,
      nextArrow: <Arrow direction="next" />,
    }),
    []
  );

  const offerSliderSettings = useMemo(
    () => ({
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
      responsive: [
        { breakpoint: 1400, settings: { slidesToShow: 3 } },
        { breakpoint: 999, settings: { slidesToShow: 2 } },
        { breakpoint: 660, settings: { slidesToShow: 1 } },
      ],
    }),
    []
  );

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="app">
      {/* HEADER SECTION */}
      <div id="header-wrap" className={isSearchOpen ? "show" : ""}>
        <div className="top-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
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

        <header id="header" className={classNames({ "fixed-top": isSticky })}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
                <div className="main-logo">
                  <Link to="/">
                    <img
                      src="./logo.jpg"
                      alt="logo"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Link>
                </div>
              </div>
              <div className="col-md-10">
                <nav id="navbar">
                  <div className="main-menu stellarnav">
                    <ul
                      className={classNames("menu-list", {
                        responsive: isMenuOpen,
                      })}
                    >
                      <li className="menu-item active">
                        <a href="#home" className="nav-link">
                          Home
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#featured-books" className="nav-link">
                          Featured
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#popular-books" className="nav-link">
                          Popular
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#special-offer" className="nav-link">
                          Offer
                        </a>
                      </li>
                      <li className="menu-item">
                        <Link to="/books" className="nav-link">
                          Library
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Thay thế phần BILLBOARD SECTION trong file của bạn */}
      <section id="billboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {heroSlides && heroSlides.length > 0 ? (
                <Slider
                  {...heroSettings}
                  className="main-slider pattern-overlay"
                >
                  {heroSlides.map((slide, index) => (
                    <div className="slider-item" key={index}>
                      <div className="banner-content">
                        <h2 className="banner-title">{slide.title}</h2>
                        {/* Bỏ hiển thị description ở đây vì DB không có */}
                        <div className="btn-wrap">
                          <Link
                            to={slide.link || "/books"}
                            className="btn btn-outline-accent btn-accent-arrow"
                          >
                            Shop Now<i className="icon icon-ns-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="banner-image"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="py-5 text-center">Đang tải banner...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS SECTION */}
      <section id="featured-books" className="py-5 my-5">
        <div className="container">
          <div className="section-header align-center">
            <div className="title">
              <span>Some quality items</span>
            </div>
            <h2 className="section-title">Featured Books</h2>
          </div>
          <div className="product-list" data-aos="fade-up">
            <div className="row">
              {featuredBooks.map((book) => (
                <div className="col-md-3" key={book.id}>
                  <ProductCard {...book} onAdd={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLING SECTION */}
      {bestSelling && (
        <section id="best-selling" className="leaf-pattern-overlay">
          <div className="container">
            <div className="row align-items-center g-4 g-lg-5">
              <div className="col-12 col-lg-6">
                <figure className="products-thumb">
                  <img
                    src={bestSelling.image}
                    alt="book"
                    className="single-image w-100"
                  />
                </figure>
              </div>
              <div className="col-12 col-lg-6">
                <div className="product-entry">
                  <h2 className="section-title divider">Best Selling Book</h2>
                  <div className="products-content">
                    <div className="author-name">{bestSelling.author}</div>
                    <h3 className="item-title">{bestSelling.title}</h3>
                    <p>{bestSelling.description}</p>
                    <div className="item-price">
                      {Number(bestSelling.price).toLocaleString()}đ
                    </div>
                    <div className="btn-wrap">
                      <button
                        onClick={() => handleAddToCart(bestSelling)}
                        className="btn btn-outline-accent btn-accent-arrow"
                      >
                        Shop It Now <i className="icon icon-ns-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POPULAR BOOKS (TABS) SECTION */}
      <section id="popular-books" className="bookshelf py-5 my-5">
        <div className="container">
          <div className="section-header align-center">
            <h2 className="section-title">Popular Books</h2>
          </div>

          <ul className="tabs">
            {Object.keys(popularBooksData).map((category) => (
              <li
                key={category}
                className={classNames("tab", {
                  active: activeTab === category,
                })}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </li>
            ))}
          </ul>

          <div className="tab-content">
            <div className="row">
              {popularBooksData[activeTab]?.map((book) => (
                <div className="col-md-3" key={book.id}>
                  <ProductCard {...book} onAdd={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL OFFER SECTION */}
      <section id="special-offer" className="bookshelf pb-5 mb-5">
        <div className="section-header align-center">
          <div className="title">
            <span>Grab your opportunity</span>
          </div>
          <h2 className="section-title">Books with offer</h2>
        </div>
        <div className="container">
          <div className="product-list" data-aos="fade-up">
            <Slider {...offerSliderSettings} className="grid product-grid">
              {specialOffers.map((book) => (
                <ProductCard key={book.id} {...book} onAdd={handleAddToCart} />
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <footer
        id="footer"
        className="py-5"
        style={{ backgroundColor: "#f3f2ec", color: "#333" }}
      >
        <div className="container">
          <div className="row d-flex justify-content-between">
            {/* CỘT GIỚI THIỆU */}
            <div className="col-md-4">
              <div className="col-md-8 text-center">
                <img
                  src="/logo.jpg"
                  alt="logo"
                  style={{
                    width: "120px",
                    height: "auto",
                    marginBottom: "20px",
                    borderRadius: "8px", // Tạo góc bo nhẹ nếu logo có nền trắng
                  }}
                  className="footer-logo algin-center"
                />
                <p
                  style={{ lineHeight: "1.6", fontSize: "15px", color: "#666" }}
                >
                  <strong>BOOKSAW</strong> - Cửa hàng sách trực tuyến uy tín
                  hàng đầu Việt Nam. Nơi kết nối tri thức và lan tỏa đam mê đọc
                  sách đến mọi nhà.
                </p>
              </div>
            </div>

            {/* CỘT LIÊN KẾT NHANH */}
            <div className="col-md-4 text-center">
              <h5
                className="widget-title text-uppercase mb-4"
                style={{ fontWeight: "700", fontSize: "16px" }}
              >
                Quick Links
              </h5>
              <ul className="menu-list list-unstyled">
                <li className="menu-item mb-2">
                  <Link
                    to="/"
                    className="text-decoration-none"
                    style={{ color: "#666" }}
                  >
                    Home
                  </Link>
                </li>
                <li className="menu-item mb-2">
                  <Link
                    to="/books"
                    className="text-decoration-none"
                    style={{ color: "#666" }}
                  >
                    Library
                  </Link>
                </li>
                <li className="menu-item mb-2">
                  <Link
                    to="/about"
                    className="text-decoration-none"
                    style={{ color: "#666" }}
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* CỘT LIÊN HỆ (Bổ sung để cân bằng giao diện) */}
            <div className="col-md-4 text-center">
              <h5
                className="widget-title text-uppercase mb-4"
                style={{ fontWeight: "700", fontSize: "16px" }}
              >
                Contact Info
              </h5>
              <p style={{ fontSize: "14px", color: "#666" }}>
                <i className="icon icon-location mr-2"></i> 123 Đường ABC, Hà
                Nội
                <br />
                <i className="icon icon-phone mr-2"></i> +84 123 456 789
                <br />
                <i className="icon icon-envelope mr-2"></i> support@booksaw.com
              </p>
            </div>
          </div>

          <hr className="my-4" style={{ opacity: "0.1" }} />

          <div className="row">
            <div className="col-md-12 text-center">
              <p style={{ fontSize: "13px", color: "#999" }}>
                © 2025 BookSaw. All rights reserved. Designed by YourName.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
