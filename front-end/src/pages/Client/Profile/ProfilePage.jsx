import { useState } from "react";
import "./ProfilePage.css";

export default function UserAccount({ user }) {
  const profile = user || {};

  // Quản lý tab sidebar đang active
  const [activeTab, setActiveTab] = useState("info");

  // Dữ liệu ví dụ cho đơn hàng, đổi mật khẩu, sổ địa chỉ (cần thay khi có API)
  const orders = [
    { id: "DH001", date: "2025-12-10", status: "Đã giao" },
    { id: "DH002", date: "2025-12-15", status: "Đang xử lý" },
  ];

  const addresses = [
    { id: 1, name: "Nhà riêng", address: "123 Đường ABC, Quận 1, TP.HCM" },
    { id: 2, name: "Cơ quan", address: "456 Đường XYZ, Quận 3, TP.HCM" },
  ];

  // Form đổi mật khẩu: trạng thái local đơn giản
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changePassMsg, setChangePassMsg] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!oldPass || !newPass || !confirmPass) {
      setChangePassMsg("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (newPass !== confirmPass) {
      setChangePassMsg("Mật khẩu mới không khớp.");
      return;
    }
    // Giả lập đổi mật khẩu thành công
    setChangePassMsg("Đổi mật khẩu thành công!");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div className="user-account-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Trang chủ <span>/</span> Trang khách hàng
      </div>

      <div className="account-wrapper">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <h3 className="sidebar-title">TRANG TÀI KHOẢN</h3>
          <p className="welcome">
            Xin chào, <span>{profile.fullname || "Khách hàng"}!</span>
          </p>

          <ul className="account-menu">
            <li
              className={activeTab === "info" ? "active" : ""}
              onClick={() => setActiveTab("info")}
            >
              Thông tin tài khoản
            </li>
            <li
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              Đơn hàng của bạn
            </li>
            <li
              className={activeTab === "password" ? "active" : ""}
              onClick={() => setActiveTab("password")}
            >
              Đổi mật khẩu
            </li>
            <li
              className={activeTab === "address" ? "active" : ""}
              onClick={() => setActiveTab("address")}
            >
              Sổ địa chỉ
            </li>
          </ul>
        </aside>

        {/* Content */}
        <section className="account-content">
          {/* Thông tin tài khoản */}
          {activeTab === "info" && (
            <>
              <h3 className="content-title">THÔNG TIN TÀI KHOẢN</h3>
              <div className="info-line">
                <span className="label">Họ tên:</span>
                <span className="value">
                  {profile.fullname || "Chưa cập nhật"}
                </span>
              </div>
              <div className="info-line">
                <span className="label">Email:</span>
                <span className="value">
                  {profile.email || "Chưa cập nhật"}
                </span>
              </div>
              <div className="info-line">
                <span className="label">Số điện thoại:</span>
                <span className="value">
                  {profile.phone_number || "Chưa cập nhật"}
                </span>
              </div>
              <div className="info-line">
                <span className="label">Vai trò:</span>
                <span className="value">
                  {profile.role_id === 1 ? "Admin" : "Customer"}
                </span>
              </div>
            </>
          )}

          {/* Đơn hàng của bạn */}
          {activeTab === "orders" && (
            <>
              <h3 className="content-title">ĐƠN HÀNG CỦA BẠN</h3>
              {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Mã đơn
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Ngày đặt
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "8px",
                          }}
                        >
                          {order.id}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "8px",
                          }}
                        >
                          {order.date}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "8px",
                          }}
                        >
                          {order.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* Đổi mật khẩu */}
          {activeTab === "password" && (
            <>
              <h3 className="content-title">ĐỔI MẬT KHẨU</h3>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    htmlFor="oldPass"
                    style={{ fontWeight: "600", color: "#7e5a3c" }}
                  >
                    Mật khẩu cũ:
                  </label>
                  <br />
                  <input
                    type="password"
                    id="oldPass"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    htmlFor="newPass"
                    style={{ fontWeight: "600", color: "#7e5a3c" }}
                  >
                    Mật khẩu mới:
                  </label>
                  <br />
                  <input
                    type="password"
                    id="newPass"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    htmlFor="confirmPass"
                    style={{ fontWeight: "600", color: "#7e5a3c" }}
                  >
                    Xác nhận mật khẩu mới:
                  </label>
                  <br />
                  <input
                    type="password"
                    id="confirmPass"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                    required
                  />
                </div>

                {changePassMsg && (
                  <p
                    style={{
                      color: changePassMsg.includes("thành công")
                        ? "green"
                        : "red",
                      marginBottom: "15px",
                      fontWeight: "600",
                    }}
                  >
                    {changePassMsg}
                  </p>
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: "#bf7c4a",
                    color: "white",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#a3663a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#bf7c4a")
                  }
                >
                  Đổi mật khẩu
                </button>
              </form>
            </>
          )}

          {/* Sổ địa chỉ */}
          {activeTab === "address" && (
            <>
              <h3 className="content-title">SỔ ĐỊA CHỈ</h3>
              {addresses.length === 0 ? (
                <p>Bạn chưa có địa chỉ nào.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {addresses.map(({ id, name, address }) => (
                    <li
                      key={id}
                      style={{
                        backgroundColor: "#f9f3e8",
                        marginBottom: "15px",
                        padding: "15px 20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <strong>{name}</strong>
                      <p style={{ margin: "8px 0 0", color: "#6b4f2e" }}>
                        {address}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
