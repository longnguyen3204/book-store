import React, { useState, useEffect } from "react";
import userApi from "../../api/userApi";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách user khi component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.getAllUsers();
        setUsers(res.data || res);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // --- HÀM CẬP NHẬT VAI TRÒ (MỚI BỔ SUNG) ---
  const handleRoleChange = async (userId, newRoleValue) => {
    try {
      const roleId = parseInt(newRoleValue); // Chuyển về kiểu số

      // Gọi API đã sửa ở trên
      await userApi.updateUserRole(userId, roleId);

      // Cập nhật state local
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role_id: roleId } : u))
      );

      alert("Cập nhật quyền người dùng thành công");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };
  // Hàm xử lý Khóa / Mở khóa
  const toggleStatus = async (user) => {
    const currentLocked = user.is_locked === 1;
    const newStatus = currentLocked ? 0 : 1;
    const actionText = currentLocked ? "MỞ KHÓA" : "KHÓA";

    if (
      window.confirm(
        `Bạn có chắc muốn ${actionText} tài khoản "${user.fullname}"?`
      )
    ) {
      try {
        await userApi.updateLockStatus(user.id, newStatus);
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, is_locked: newStatus } : u
          )
        );
      } catch (error) {
        alert("Lỗi cập nhật trạng thái: " + error.message);
      }
    }
  };

  return (
    <div
      className="container-fluid py-4 bg-light"
      style={{ minHeight: "100vh" }}
    >
      {/* --- HEADER --- */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
        <h3 className="fw-bold text-uppercase text-primary m-0">
          <i className="bi bi-people-fill me-2"></i>Quản lý Khách hàng
        </h3>
        <span className="badge bg-primary fs-6 rounded-pill px-4 py-2">
          Tổng: {users.length} thành viên
        </span>
      </div>

      {/* --- TABLE --- */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead className="bg-light text-dark text-uppercase small fw-bold text-center border-bottom">
              <tr>
                <th className="text-center" style={{ width: "5%" }}>
                  ID
                </th>
                <th className="text-center ps-4" style={{ width: "25%" }}>
                  Thành viên
                </th>
                <th className="text-center">Liên hệ</th>
                <th className="text-center">Tổng đơn</th>
                <th className="text-center">Vai trò</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <div
                      className="spinner-border text-primary me-2"
                      role="status"
                    />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-bottom">
                    <td className="text-center text-muted fw-bold">
                      {user.id}
                    </td>

                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={user.avatar || "/logo.jpg"}
                          alt="avatar"
                          className="rounded-circle me-3 border"
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <div>
                          <div className="fw-bold text-dark">
                            {user.fullname || "Không tên"}
                          </div>
                          <div className="small text-muted">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="text-start">
                      <div className="small">
                        <i className="bi bi-telephone me-1"></i>{" "}
                        {user.phone_number || "---"}
                      </div>
                      <div
                        className="small text-muted text-truncate"
                        style={{ maxWidth: "200px" }}
                        title={user.address}
                      >
                        <i className="bi bi-geo-alt me-1"></i>{" "}
                        {user.address || "Chưa cập nhật"}
                      </div>
                    </td>

                    <td className="text-center">
                      <span className="badge bg-light text-dark border fs-6">
                        {user.total_orders || 0}
                      </span>
                    </td>

                    {/* Cột Vai trò - ĐÃ CẬP NHẬT THÀNH SELECT BOX */}
                    <td className="text-center">
                      <span
                        className={`badge rounded-pill fw-bold px-3 py-2 ${
                          user.role_id === 1
                            ? "bg-danger bg-opacity-10 text-danger"
                            : "bg-info bg-opacity-10 text-info"
                        }`}
                        style={{
                          fontSize: "0.85rem",
                          minWidth: "100px",
                          display: "inline-block",
                        }}
                      >
                        {user.role_id === 1 ? "Admin" : "Khách hàng"}
                      </span>
                    </td>

                    <td className="text-center">
                      {user.is_locked === 1 ? (
                        <span className="badge bg-secondary px-3 rounded-pill text-dark ">
                          Đã khóa
                        </span>
                      ) : (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 rounded-pill">
                          Hoạt động
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      {user.is_locked === 1 ? (
                        <button
                          className="btn btn-sm btn-success shadow-sm"
                          onClick={() => toggleStatus(user)}
                        >
                          <i className="bi bi-unlock-fill me-1"></i> Mở
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-danger shadow-sm"
                          onClick={() => toggleStatus(user)}
                        >
                          <i className="bi bi-lock-fill me-1"></i> Khóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Chưa có thành viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
