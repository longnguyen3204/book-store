import React from 'react'

// Khung giao diện cho khách: bọc nội dung với header/footer đơn giản.
export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <div className="container">
          <a href="/" className="logo">
            BOOKSAW
          </a>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#featured-books">Books</a>
            <a href="#popular-books">Popular</a>
            <a href="#special-offer">Offer</a>
          </nav>
        </div>
      </header>

      <main className="main-layout__content">{children}</main>

      <footer className="main-layout__footer">
        <div className="container">
          <p>© 2025 BOOKSAW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
