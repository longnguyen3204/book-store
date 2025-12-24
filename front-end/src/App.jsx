import { Routes, Route, useNavigate, Router } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import ScrollToTop from "./layouts/scrollToTop.js";

// Import các trang phía Client
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import DetailProduct from "./pages/Shop/BookDetailPage";
import SearchPage from "./pages/Shop/SearchPage";

// Import các trang phía Admin
import AdminLayout from "./layouts/AdminLayout";
import BookManager from "./pages/Admin/BookManager";
import OrderManager from "./pages/Admin/OrderManager";
import UserManager from "./pages/Admin/UserManager";
import CategoryManager from "./pages/Admin/CategoryManager";
import VoucherManager from "./pages/Admin/VoucherManager.jsx";

// Sửa lại đường dẫn ProfilePage (thêm /Client/)
import ProfilePage from "./pages/Profile/ProfilePage.jsx";

// Giữ nguyên hoặc kiểm tra lại ShopPage (đảm bảo file nằm trong src/pages/Shop/)
import ShopPage from "./pages/Shop/ShopPage.jsx";
import CartPage from "./pages/Cart/CartPage.jsx";
import CheckoutPage from "./pages/Cart/Checkout/CheckoutPage.jsx";
import HistoryPage from "./pages/History/HistoryPage.jsx";
function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Giữ nguyên logic kiểm tra đăng nhập
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (result) => {
    if (result?.token) {
      localStorage.setItem("token", result.token);
    }
    if (result?.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
      setUser(result.user);
    }
    const roleId = result?.user?.role_id;
    // Nếu là admin (role_id = 1) thì chuyển hướng vào trang admin, ngược lại về trang chủ
    return roleId === 1 ? "/admin" : "/";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleBackHome = () => navigate("/");

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* --- ROUTES CHO KHÁCH HÀNG (CLIENT) --- */}
        <Route path="/" element={<HomePage user={user} />} />
        scrollToTop
        <Route path="/books/:id" element={<DetailProduct />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/books" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-history" element={<HistoryPage user={user} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              user={user}
              setUser={setUser}
              onBack={handleBackHome}
              onLogout={() => {
                handleLogout();
                navigate("/");
              }}
            />
          }
        />
        {/* --- ROUTES CHO ADMIN --- */}
        {/* AdminLayout sẽ bao bọc các route con bên trong */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Route index: Khi vào /admin sẽ mặc định hiện trang Quản lý Sách */}
          <Route index element={<BookManager />} />

          {/* Các trang chức năng cụ thể */}
          <Route path="books" element={<BookManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="vouchers" element={<VoucherManager />} />
          <Route path="users" element={<UserManager />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
