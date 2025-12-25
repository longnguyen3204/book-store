import { Routes, Route, useNavigate, Router } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import ScrollToTop from "./layouts/scrollToTop.js";
import PrivateRoute from "./PrivateRoute.jsx";

// Import các trang phía Client
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPassword from "./pages/ForgotPass/ForgotPass.jsx";
import RegisterPage from "./pages/Register/RegisterPage";
import DetailProduct from "./pages/Shop/BookDetailPage";
import SearchPage from "./pages/Shop/SearchPage";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import ShopPage from "./pages/Shop/ShopPage.jsx";
import CartPage from "./pages/Cart/CartPage.jsx";
import CheckoutPage from "./pages/Cart/Checkout/CheckoutPage.jsx";
import HistoryPage from "./pages/History/HistoryPage.jsx";
// Import các trang phía Admin
import AdminLayout from "./layouts/AdminLayout";
import BookManager from "./pages/Admin/BookManager";
import OrderManager from "./pages/Admin/OrderManager";
import UserManager from "./pages/Admin/UserManager";
import CategoryManager from "./pages/Admin/CategoryManager";
import VoucherManager from "./pages/Admin/VoucherManager.jsx";
import BannerManager from "./pages/Admin/BannerManager.jsx";

// Sửa lại đường dẫn ProfilePage (thêm /Client/)

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

        <Route path="/books/:id" element={<DetailProduct />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/books" element={<ShopPage />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <PrivateRoute>
              <HistoryPage user={user} />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage
                user={user}
                setUser={setUser}
                onBack={handleBackHome}
                onLogout={() => {
                  handleLogout();
                  navigate("/");
                }}
              />
            </PrivateRoute>
          }
        />
        {/* --- ROUTES CHO ADMIN --- */}
        {/* AdminLayout sẽ bao bọc các route con bên trong */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Route index: Khi vào /admin sẽ mặc định hiện trang Quản lý Sách */}
          <Route
            index
            element={
              <PrivateRoute>
                <BookManager />
              </PrivateRoute>
            }
          />

          {/* Các trang chức năng cụ thể */}
          <Route
            path="books"
            element={
              <PrivateRoute>
                <BookManager />
              </PrivateRoute>
            }
          />
          <Route
            path="categories"
            element={
              <PrivateRoute>
                <CategoryManager />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute>
                <OrderManager />
              </PrivateRoute>
            }
          />
          <Route
            path="vouchers"
            element={
              <PrivateRoute>
                <VoucherManager />
              </PrivateRoute>
            }
          />
          <Route
            path="banner"
            element={
              <PrivateRoute>
                <BannerManager />
              </PrivateRoute>
            }
          />
          <Route
            path="users"
            element={
              <PrivateRoute>
                <UserManager />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
