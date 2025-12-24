import React from "react";
import { Link } from "react-router-dom"; // Sử dụng Link nếu dùng React Router

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 tracking-wider"
          >
            BOOKSAW
          </Link>

          <nav className="hidden md:flex space-x-8 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <a
              href="#featured-books"
              className="hover:text-blue-600 transition"
            >
              Books
            </a>
            <a href="#popular-books" className="hover:text-blue-600 transition">
              Popular
            </a>
            <a href="#special-offer" className="hover:text-blue-600 transition">
              Offer
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <span className="sr-only">Search</span>
              🔍
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <span className="sr-only">Cart</span>
              🛒
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BOOKSAW</h3>
              <p className="text-gray-400">
                Cửa hàng sách trực tuyến hàng đầu cho mọi độc giả.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-gray-800 px-4 py-2 rounded-l focus:outline-none w-full"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700">
                  Gửi
                </button>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} BOOKSAW. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
