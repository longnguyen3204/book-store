import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

// Import các trang phía Client
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ProfilePage from "./pages/Client/Profile/ProfilePage";
import DetailProduct from "./pages/Client/BookDetailPage";
import SearchPage from "./pages/Client/SearchPage";

// Import các trang phía Admin
// Lưu ý: Đảm bảo bạn đã tạo các file này trong thư mục tương ứng
import AdminLayout from './components/AdminLayout'; // Layout nằm trong components như bạn yêu cầu
import BookManager from './pages/Admin/BookManager';
import OrderManager from './pages/Admin/OrderManager';
import UserManager from './pages/Admin/UserManager';
import CategoryManager from './pages/Admin/CategoryManager';

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
      {/* --- ROUTES CHO KHÁCH HÀNG (CLIENT) --- */}
      <Route path="/" element={<HomePage user={user} />} />
      <Route path="/product/:id" element={<DetailProduct />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage />} />
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

      {/* --- ROUTES CHO ADMIN --- */}
      {/* AdminLayout sẽ bao bọc các route con bên trong */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Route index: Khi vào /admin sẽ mặc định hiện trang Quản lý Sách */}
        <Route index element={<BookManager />} /> 
        
        {/* Các trang chức năng cụ thể */}
        <Route path="books" element={<BookManager />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="users" element={<UserManager />} />
      </Route>
      
    </Routes>
  );
}

export default App;