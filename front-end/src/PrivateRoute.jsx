import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 1. Kiểm tra đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra quyền truy cập (Role)
  if (allowRoles && !allowRoles.includes(user.role_name)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
