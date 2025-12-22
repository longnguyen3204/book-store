import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import CartPage from "./pages/Cart/CartPage.jsx";
import CheckoutPage from "./pages/Cart/Checkout/CheckoutPage.jsx";
import HistoryPage from "./pages/History/HistoryPage";
// App.jsx

// Sửa lại đường dẫn ProfilePage (thêm /Client/)
import ProfilePage from "./pages/Client/Profile/ProfilePage.jsx"; 

// Giữ nguyên hoặc kiểm tra lại ShopPage (đảm bảo file nằm trong src/pages/Shop/)
import ShopPage from "./pages/Shop/ShopPage.jsx";
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
    
    <Routes>
      // App.jsx
<Route path="/" element={<HomePage user={user} />} />
      // App.jsx
<Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route
        path="/profile"
        element={
          <ProfilePage
            user={user}
            onBack={handleBackHome}
            onLogout={() => {
              handleLogout();
              navigate("/");
            }}
          />
        }
      />
      <Route
        path="/order-history"
        element={
          <HistoryPage
            user={user}
            onBack={handleBackHome}
            onLogout={() => {
              handleLogout();
              navigate("/");
            }}
          />
        }
      />
    </Routes>
    
  );
}

export default App;
