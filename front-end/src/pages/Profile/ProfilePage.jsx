import { useState, useEffect } from "react";
import "./ProfilePage.css";
import Header from "../../components/Header";
import userApi from "../../api/userApi";
import orderApi from "../../api/orderApi";
import {
  UserOutlined,
  ShoppingOutlined,
  LockOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  RightOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { message, Spin } from "antd";

export default function UserAccount({ user: propUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dùng state nội bộ để quản lý thông tin User thực tế từ API
  const [currentUser, setCurrentUser] = useState(propUser || {});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  // 1. Lấy dữ liệu Profile mới nhất từ Server khi load trang
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await userApi.getProfile();
        const data = res.data || res; // Tùy cấu trúc API trả về
        setCurrentUser(data);
        setFormData({
          fullname: data.fullname || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
        });
        // Cập nhật lại localStorage để đồng bộ toàn app
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("Không thể lấy thông tin mới nhất");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 2. Lấy lịch sử đơn hàng
  useEffect(() => {
    if (activeTab === "orders") {
      const fetchHistory = async () => {
        setOrderLoading(true);
        try {
          const data = await orderApi.getOrderHistory();
          setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
          message.error("Không tải được lịch sử đơn hàng");
        } finally {
          setOrderLoading(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateProfile(formData);
      message.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);

      // Sau khi lưu, cập nhật lại state hiển thị
      const updatedData = { ...currentUser, ...formData };
      setCurrentUser(updatedData);
      localStorage.setItem("user", JSON.stringify(updatedData));
    } catch (error) {
      message.error(error.message || "Cập nhật thất bại");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullname: currentUser.fullname || "",
      email: currentUser.email || "",
      phone_number: currentUser.phone_number || "",
      address: currentUser.address || "",
    });
    setIsEditing(false);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  if (loading)
    return (
      <div className="loading-center">
        <Spin size="large" />
      </div>
    );

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra khớp mật khẩu
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return message.error("Mật khẩu xác nhận không khớp!");
    }

    // 2. Kiểm tra độ dài mật khẩu
    if (passwordData.newPassword.length < 6) {
      return message.error("Mật khẩu mới phải từ 6 ký tự trở lên!");
    }

    try {
      setLoading(true);
      // ĐỔI KEY: từ oldPassword sang currentPassword để khớp Backend
      await userApi.changePassword({
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      message.success("Đổi mật khẩu thành công!");

      // Reset form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Hiển thị thông báo lỗi chi tiết từ Server nếu có
      const serverMsg =
        error.response?.data?.message || "Mật khẩu hiện tại không đúng!";
      message.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Tận dụng API updateProfile sẵn có
      await userApi.updateProfile({
        ...currentUser,
        address: addressInput,
      });

      message.success("Cập nhật địa chỉ thành công!");
      setIsEditingAddress(false);

      // Cập nhật lại state local và localStorage
      const updatedData = { ...currentUser, address: addressInput };
      setCurrentUser(updatedData);
      localStorage.setItem("user", JSON.stringify(updatedData));
    } catch (error) {
      message.error("Không thể cập nhật địa chỉ");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="user-account-page">
      <Header />
      <div className="container" style={{ paddingTop: "100px" }}>
        <div className="custom-breadcrumb">
          Trang chủ <RightOutlined className="sep" />{" "}
          <span>Trang khách hàng</span>
        </div>

        <div className="account-grid">
          <aside className="account-sidebar">
            <div className="user-avatar-section">
              <div className="avatar-circle">
                {currentUser.fullname?.charAt(0) || "U"}
              </div>
              <div className="user-brief">
                <p>Xin chào,</p>
                <h4>{currentUser.fullname || "Khách hàng"}</h4>
              </div>
            </div>

            <ul className="account-menu">
              <li
                className={activeTab === "info" ? "active" : ""}
                onClick={() => setActiveTab("info")}
              >
                <UserOutlined /> Thông tin tài khoản
              </li>
              <li
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingOutlined /> Đơn hàng của bạn
              </li>
              <li
                className={activeTab === "password" ? "active" : ""}
                onClick={() => setActiveTab("password")}
              >
                <LockOutlined /> Đổi mật khẩu
              </li>
              <li
                className={activeTab === "address" ? "active" : ""}
                onClick={() => setActiveTab("address")}
              >
                <EnvironmentOutlined /> Sổ địa chỉ
              </li>
              <li className="logout-btn" onClick={onLogout}>
                <LogoutOutlined /> Đăng xuất
              </li>
            </ul>
          </aside>

          <main className="account-main-content">
            <div className="content-inner-card">
              {activeTab === "info" && (
                <div className="tab-content">
                  <div className="pane-header-flex">
                    <h3 className="tab-title">Thông tin tài khoản</h3>
                    {!isEditing && (
                      <button
                        className="btn-outline-edit"
                        onClick={() => setIsEditing(true)}
                      >
                        <EditOutlined /> Chỉnh sửa
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleUpdateProfile} className="profile-form">
                    <div className="info-display-grid">
                      <div className="info-group">
                        <label>Họ và tên</label>
                        <input
                          type="text"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? "readonly-input" : ""}
                        />
                      </div>
                      <div className="info-group">
                        <label>Số điện thoại</label>
                        <input
                          type="text"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? "readonly-input" : ""}
                        />
                      </div>
                      <div className="info-group">
                        <label>Email (Cố định)</label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="disabled-input"
                        />
                      </div>
                      <div className="info-group">
                        <label>Địa chỉ nhận hàng</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? "readonly-input" : ""}
                          placeholder="Chưa có thông tin địa chỉ"
                        />
                      </div>
                      <div className="info-group">
                        <label>Vai trò</label>
                        <div className="value tag">
                          {currentUser.role_id === 1
                            ? "Quản Trị Viên"
                            : "Khách Hàng"}
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div
                        className="form-actions"
                        style={{ marginTop: "20px" }}
                      >
                        <button type="submit" className="btn-action-primary">
                          <SaveOutlined /> Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          className="btn-action-cancel"
                          onClick={handleCancelEdit}
                        >
                          <CloseOutlined /> Hủy
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="tab-content">
                  <h3 className="tab-title">Đơn hàng của bạn</h3>
                  {orderLoading ? (
                    <div className="text-center py-5">
                      <Spin />
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="empty-msg">Bạn chưa có đơn hàng nào.</p>
                  ) : (
                    <div className="table-wrapper">
                      <table className="order-table">
                        <thead>
                          <tr>
                            <th>Mã đơn</th>
                            <th>Ngày đặt</th>
                            <th>Thành tiền</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.order_id}>
                              <td className="fw-bold">#{order.order_id}</td>
                              <td>
                                {new Date(order.created_at).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </td>
                              <td className="text-danger fw-bold">
                                {formatCurrency(order.total_amount)}
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${
                                    order.status === "completed"
                                      ? "done"
                                      : "process"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "address" && (
                <div className="tab-content">
                  <div className="pane-header-flex">
                    <h3 className="tab-title">Sổ địa chỉ</h3>
                    {!isEditingAddress && (
                      <button
                        className="btn-outline-edit"
                        onClick={() => setIsEditingAddress(true)}
                      >
                        <EditOutlined /> Thay đổi địa chỉ
                      </button>
                    )}
                  </div>

                  <div className="address-grid">
                    <div
                      className="address-item-card"
                      style={{ width: "100%" }}
                    >
                      <div className="addr-icon">
                        <EnvironmentOutlined />
                      </div>
                      <div className="addr-text" style={{ flex: 1 }}>
                        <strong>Địa chỉ mặc định</strong>

                        {isEditingAddress ? (
                          <form
                            onSubmit={handleUpdateAddress}
                            style={{ marginTop: "10px" }}
                          >
                            <textarea
                              className="form-control mb-2"
                              rows="3"
                              value={addressInput}
                              onChange={(e) => setAddressInput(e.target.value)}
                              placeholder="Nhập địa chỉ giao hàng chi tiết..."
                              required
                              style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                              }}
                            />
                            <div className="form-actions">
                              <button
                                type="submit"
                                className="btn-action-primary"
                                disabled={loading}
                              >
                                <SaveOutlined /> Lưu địa chỉ
                              </button>
                              <button
                                type="button"
                                className="btn-action-cancel"
                                onClick={() => setIsEditingAddress(false)}
                              >
                                <CloseOutlined /> Hủy
                              </button>
                            </div>
                          </form>
                        ) : (
                          <p style={{ marginTop: "5px", color: "#666" }}>
                            {currentUser.address ||
                              "Bạn chưa cập nhật địa chỉ giao hàng."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className="tab-content">
                  <h3 className="tab-title">Đổi mật khẩu</h3>
                  <form
                    className="password-form"
                    onSubmit={handlePasswordChange}
                  >
                    <div className="form-input-group">
                      <label>Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        required
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            oldPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Mật khẩu mới</label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-submit-pass"
                      disabled={loading}
                    >
                      {loading ? <Spin size="small" /> : "Cập nhật mật khẩu"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
