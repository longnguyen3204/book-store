import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ProfilePage from "./pages/Client/Profile/ProfilePage";

function AdminPlaceholder() {
  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>Admin dashboard</h1>
      <p>Chưa có trang admin. Bạn đã đăng nhập với vai trò admin.</p>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      <Route path="/" element={<HomePage user={user} />} />
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
      <Route path="/admin" element={<AdminPlaceholder />} />
    </Routes>
  );
}

export default App;
