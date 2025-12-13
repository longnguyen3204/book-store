import { useEffect, useMemo, useState } from 'react'
import Slider from 'react-slick'
import classNames from 'classnames'
import AOS from 'aos'
import {
  heroSlides,
  clientLogos,
  featuredBooks,
  bestSelling,
  popularBooks,
  specialOffers,
  blogPosts,
  brandAssets,
} from './data/content'
import './App.css'

const Arrow = ({ direction, onClick }) => (
  <button
    type="button"
    className={classNames('slick-arrow', direction === 'prev' ? 'prev' : 'next')}
    onClick={onClick}
    aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
  >
    <i className={`icon icon-arrow-${direction === 'prev' ? 'left' : 'right'}`}></i>
  </button>
)

const ProductCard = ({ title, author, price, image, prevPrice }) => (
  <div className="product-item">
    <figure className="product-style">
      <img src={image} alt={title} className="product-item" />
      <button type="button" className="add-to-cart" data-product-tile="add-to-cart">
        Add to Cart
      </button>
    </figure>
    <figcaption>
      <h3>{title}</h3>
      <span>{author}</span>
      <div className="item-price">
        {prevPrice && <span className="prev-price">{prevPrice}</span>}
        {price}
      </div>
    </figcaption>
  </div>
)

function App() {
  const [activeTab, setActiveTab] = useState('all-genre')
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [isSticky, setSticky] = useState(false)
  const tabLabels = {
    'all-genre': 'All Genre',
    business: 'Business',
    technology: 'Technology',
    romantic: 'Romantic',
    adventure: 'Adventure',
    fictional: 'Fictional',
  }

  useEffect(() => {
    AOS.init({ duration: 1200, once: true })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setSticky(window.scrollY >= 200)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (event) => {
      if (isSearchOpen && !event.target.closest('.search-bar')) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isSearchOpen])

  const heroSettings = useMemo(
    () => ({
      dots: true,
      arrows: true,
      fade: true,
      autoplay: false,
      prevArrow: <Arrow direction="prev" />,
      nextArrow: <Arrow direction="next" />,
    }),
    [],
  )

  const offerSliderSettings = useMemo(
    () => ({
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: { slidesToShow: 3 },
        },
        {
          breakpoint: 999,
          settings: { slidesToShow: 2 },
        },
        {
          breakpoint: 660,
          settings: { slidesToShow: 1 },
        },
      ],
    }),
    [],
  )

  const toggleMenu = () => setMenuOpen((open) => !open)
  const closeMenu = () => setMenuOpen(false)
  const toggleSearch = (event) => {
    event.preventDefault()
    setSearchOpen((open) => !open)
  }

  return (
    <div className="app">
      <div id="header-wrap" className={isSearchOpen ? 'show' : ''}>
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
                <div className="right-element">
                  <a href="#" className="user-account for-buy">
                    <i className="icon icon-user"></i>
                    <span>Account</span>
                  </a>
                  <a href="#" className="cart for-buy">
                    <i className="icon icon-clipboard"></i>
                    <span>Cart:(0 $)</span>
                  </a>
                  <div className="action-menu">
                    <div className="search-bar">
                      <a
                        href="#"
                        className={classNames('search-button', 'search-toggle', { active: isSearchOpen })}
                        onClick={toggleSearch}
                        data-selector="#header-wrap"
                      >
                        <i className="icon icon-search"></i>
                      </a>
                      <form role="search" className="search-box">
                        <input className="search-field text search-input" placeholder="Search" type="search" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <header id="header" className={classNames({ 'fixed-top': isSticky })}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
                <div className="main-logo">
                  <a href="#home">
                    <img src={brandAssets.logo} alt="logo" />
                  </a>
                </div>
              </div>
              <div className="col-md-10">
                <nav id="navbar">
                  <div className="main-menu stellarnav">
                    <ul className={classNames('menu-list', { responsive: isMenuOpen })}>
                      <li className="menu-item active">
                        <a href="#home" className="nav-link" onClick={closeMenu}>
                          Home
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#pages" className="nav-link" onClick={closeMenu}>
                          Pages
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#featured-books" className="nav-link" onClick={closeMenu}>
                          Featured
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#popular-books" className="nav-link" onClick={closeMenu}>
                          Popular
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#special-offer" className="nav-link" onClick={closeMenu}>
                          Offer
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#latest-blog" className="nav-link" onClick={closeMenu}>
                          Articles
                        </a>
                      </li>
                      {/* Download App menu item removed */}
                    </ul>
                    <div className={classNames('hamburger', { active: isMenuOpen })} onClick={toggleMenu}>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </header>
      </div>

      <section id="home"></section>
      <section id="pages" aria-hidden="true"></section>
      <section id="billboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Slider {...heroSettings} className="main-slider pattern-overlay">
                {heroSlides.map((slide) => (
                  <div className="slider-item" key={slide.title}>
                    <div className="banner-content">
                      <h2 className="banner-title">{slide.title}</h2>
                      <p>{slide.description}</p>
                      <div className="btn-wrap">
                        <a href="#" className="btn btn-outline-accent btn-accent-arrow">
                          Read More<i className="icon icon-ns-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                    <img src={slide.image} alt={slide.title} className="banner-image" />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      <section id="client-holder" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="inner-content">
              <div className="logo-wrap">
                <div className="grid">
                  {clientLogos.map((logo, index) => (
                    <a href="#" key={logo + index}>
                      <img src={logo} alt="client" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured-books" className="py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header align-center">
                <div className="title">
                  <span>Some quality items</span>
                </div>
                <h2 className="section-title">Featured Books</h2>
              </div>

              <div className="product-list" data-aos="fade-up">
                <div className="row">
                  {featuredBooks.map((book) => (
                    <div className="col-md-3" key={book.title}>
                      <ProductCard {...book} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="btn-wrap align-right">
                <a href="#" className="btn-accent-arrow">
                  View all products <i className="icon icon-ns-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="best-selling" className="leaf-pattern-overlay">
        <div className="corner-pattern-overlay"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="row align-items-center g-4 g-lg-5">
                <div className="col-12 col-lg-6">
                  <figure className="products-thumb">
                    <img src={bestSelling.image} alt="book" className="single-image w-100" />
                  </figure>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="product-entry">
                    <h2 className="section-title divider">{bestSelling.title}</h2>
                    <div className="products-content">
                      <div className="author-name">{bestSelling.author}</div>
                      <h3 className="item-title">{bestSelling.bookTitle}</h3>
                      <p>{bestSelling.description}</p>
                      <div className="item-price">{bestSelling.price}</div>
                      <div className="btn-wrap">
                        <a href="#" className="btn-accent-arrow">
                          shop it now <i className="icon icon-ns-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="popular-books" className="bookshelf py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header align-center">
                <div className="title">
                  <span>Some quality items</span>
                </div>
                <h2 className="section-title">Popular Books</h2>
              </div>

              <ul className="tabs">
                {Object.keys(popularBooks).map((key) => (
                  <li
                    key={key}
                    data-tab-target={`#${key}`}
                    className={classNames('tab', { active: activeTab === key })}
                    onClick={() => setActiveTab(key)}
                  >
                    {tabLabels[key] ?? key}
                  </li>
                ))}
              </ul>

              <div className="tab-content">
                {Object.entries(popularBooks).map(([key, items]) => (
                  <div
                    key={key}
                    id={key}
                    data-tab-content
                    className={classNames({ active: activeTab === key })}
                  >
                    {activeTab === key && (
                      <>
                        <div className="row">
                          {items.slice(0, 4).map((book) => (
                            <div className="col-md-3" key={`${key}-${book.title}`}>
                              <ProductCard {...book} />
                            </div>
                          ))}
                        </div>
                        {items.length > 4 && (
                          <div className="row">
                            {items.slice(4).map((book) => (
                              <div className="col-md-3" key={`${key}-${book.title}-extra`}>
                                <ProductCard {...book} />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quotation" className="align-center pb-5 mb-5">
        <div className="inner-content">
          <h2 className="section-title divider">Quote of the day</h2>
          <blockquote data-aos="fade-up">
            <q>
              “The more that you read, the more things you will know. The more that you learn, the more places you’ll
              go.”
            </q>
            <div className="author-name">Dr. Seuss</div>
          </blockquote>
        </div>
      </section>

      <section id="special-offer" className="bookshelf pb-5 mb-5">
        <div className="section-header align-center">
          <div className="title">
            <span>Grab your opportunity</span>
          </div>
          <h2 className="section-title">Books with offer</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="inner-content">
              <div className="product-list" data-aos="fade-up">
                <Slider {...offerSliderSettings} className="grid product-grid">
                  {specialOffers.map((book) => (
                    <ProductCard key={book.title + book.price} {...book} />
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="subscribe">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6">
                  <div className="title-element">
                    <h2 className="section-title divider">Subscribe to our newsletter</h2>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="subscribe-content" data-aos="fade-up">
                    <p>
                      Sed eu feugiat amet, libero ipsum enim pharetra hac dolor sit amet, consectetur. Elit adipiscing
                      enim pharetra hac.
                    </p>
                    <form id="form">
                      <input type="text" name="email" placeholder="Enter your email addresss here" />
                      <button className="btn-subscribe">
                        <span>send</span>
                        <i className="icon icon-send"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="latest-blog" className="py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header align-center">
                <div className="title">
                  <span>Read our articles</span>
                </div>
                <h2 className="section-title">Latest Articles</h2>
              </div>
              <div className="row">
                {blogPosts.map((post, index) => (
                  <div className="col-md-4" key={post.title + index}>
                    <article className="column" data-aos="fade-up" data-aos-delay={index * 200}>
                      <figure>
                        <a href="#" className="image-hvr-effect">
                          <img src={post.image} alt="post" className="post-image" />
                        </a>
                      </figure>
                      <div className="post-item">
                        <div className="meta-date">{post.date}</div>
                        <h3>
                          <a href="#">{post.title}</a>
                        </h3>
                        <div className="links-element">
                          <div className="categories">{post.category}</div>
                          <div className="social-links">
                            <ul>
                              <li>
                                <a href="#">
                                  <i className="icon icon-facebook"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="icon icon-twitter"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="icon icon-behance-square"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="btn-wrap align-center">
                  <a href="#" className="btn btn-outline-accent btn-accent-arrow" tabIndex={0}>
                    Read All Articles<i className="icon icon-ns-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App section removed */}

      <footer id="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="footer-item">
                <div className="company-brand">
                  <img src={brandAssets.logo} alt="logo" className="footer-logo" />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis sed ptibus liberolectus nonet
                    psryroin. Amet sed lorem posuere sit iaculis amet, ac urna. Adipiscing fames semper erat ac in
                    suspendisse iaculis.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="footer-menu">
                <h5>About Us</h5>
                <ul className="menu-list">
                  <li className="menu-item">
                    <a href="#">vision</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">articles </a>
                  </li>
                  <li className="menu-item">
                    <a href="#">careers</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">service terms</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">donate</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-2">
              <div className="footer-menu">
                <h5>Discover</h5>
                <ul className="menu-list">
                  <li className="menu-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Books</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Authors</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Subjects</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Advanced Search</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-2">
              <div className="footer-menu">
                <h5>My account</h5>
                <ul className="menu-list">
                  <li className="menu-item">
                    <a href="#">Sign In</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">View Cart</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">My Wishtlist</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Track My Order</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-2">
              <div className="footer-menu">
                <h5>Help</h5>
                <ul className="menu-list">
                  <li className="menu-item">
                    <a href="#">Help center</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Report a problem</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Suggesting edits</a>
                  </li>
                  <li className="menu-item">
                    <a href="#">Contact us</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div id="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="copyright">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      © 2022 All rights reserved. Free HTML Template by{' '}
                      <a href="https://www.templatesjungle.com/" target="_blank" rel="noreferrer">
                        TemplatesJungle
                      </a>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="social-links align-right">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
