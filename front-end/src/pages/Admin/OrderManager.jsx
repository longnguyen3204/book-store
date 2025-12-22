import React, { useState, useEffect } from "react";
import orderApi from "../../api/orderApi";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.fetchOrders();
      const data = Array.isArray(res) ? res : res.data || [];

      // Sắp xếp đơn mới nhất lên đầu
      const sortedOrders = data.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.order_date);
        const dateB = new Date(b.createdAt || b.order_date);
        return dateB - dateA;
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Flow trạng thái
  const getNextStatus = (currentStatus) => {
    const statusMap = {
      pending: "processing",
      processing: "shipping",
      shipping: "completed",
    };
    return statusMap[(currentStatus || "").toLowerCase()] || null;
  };

  // Xử lý chuyển trạng thái
  const handleNextStep = async (id, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    const statusVN = {
      processing: "ĐANG XỬ LÝ",
      shipping: "ĐANG GIAO HÀNG",
      completed: "HOÀN THÀNH",
    };

    if (
      window.confirm(
        `Xác nhận chuyển trạng thái sang "${
          statusVN[nextStatus] || nextStatus.toUpperCase()
        }"?`
      )
    ) {
      try {
        await orderApi.updateOrderStatus(id, nextStatus);
        loadOrders();
      } catch (error) {
        alert("Lỗi cập nhật: " + error.message);
      }
    }
  };

  // Xử lý hủy đơn
  const handleCancel = async (id) => {
    if (window.confirm("Cảnh báo: Bạn có chắc chắn muốn HỦY đơn hàng này?")) {
      try {
        await orderApi.updateOrderStatus(id, "cancelled");
        loadOrders();
      } catch (error) {
        alert("Lỗi hủy đơn: " + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString)
      .toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(",", " -");
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
  };

  // [SỬA] Hiển thị Badge trạng thái chuẩn xác hơn
  const renderStatusBadge = (status) => {
    // Mặc định là màu xám (Unknown) thay vì màu xanh (Success) để tránh hiểu nhầm
    let badgeClass = "bg-secondary";
    let icon = "❓";
    let label = "Chưa cập nhật";

    const s = (status || "").toLowerCase();

    switch (s) {
      case "pending":
        badgeClass = "bg-warning text-dark";
        icon = "⏳";
        label = "Chờ xử lý";
        break;
      case "processing":
        badgeClass = "bg-info text-dark";
        icon = "⚙️";
        label = "Đang xử lý";
        break;
      case "shipping":
        badgeClass = "bg-primary";
        icon = "🚚";
        label = "Đang giao";
        break;
      case "completed":
        badgeClass = "bg-success";
        icon = "✅";
        label = "Hoàn thành";
        break;
      case "cancelled":
        badgeClass = "bg-danger";
        icon = "❌";
        label = "Đã hủy";
        break;
      default:
        if (status) label = status; // Nếu có status lạ thì hiện tên gốc
        break;
    }

    return (
      <span className={`badge rounded-pill ${badgeClass} px-3 py-2 shadow-sm`}>
        {icon} {label}
      </span>
    );
  };

  return (
    <div
      className="container-fluid py-4 bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
        <h3 className="fw-bold text-uppercase text-primary m-0">
          <i className="bi bi-receipt-cutoff me-2"></i>Quản lý Đơn hàng
        </h3>
        <span className="badge bg-primary fs-6 rounded-pill px-4 py-2">
          Tổng: {orders.length} đơn
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-dark text-uppercase small fw-bold text-center border-bottom">
              <tr>
                <th className="py-3" style={{ width: "80px" }}>
                  Mã
                </th>
                <th className="py-3" style={{ width: "150px" }}>
                  Thời gian
                </th>
                <th className="py-3 text-start ps-4">Khách hàng</th>
                <th className="py-3 text-start">Sản phẩm</th>
                <th className="py-3">Tổng tiền</th>
                <th className="py-3">Trạng thái</th>
                <th className="py-3" style={{ width: "180px" }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-dark">
                    <div
                      className="spinner-border text-primary me-2"
                      role="status"
                    />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  const currentStatus = (order.status || "").toLowerCase();
                  const nextStatus = getNextStatus(currentStatus);

                  // [QUAN TRỌNG] Logic ẩn nút
                  const isFinished =
                    !currentStatus ||
                    ["completed", "complete", "cancelled"].includes(
                      currentStatus
                    );

                  return (
                    <tr key={order.id || order._id} className="border-bottom">
                      <td className="fw-bold text-primary text-center">
                        #{order.id}
                      </td>
                      <td className="text-center text-muted small">
                        {formatDate(order.createdAt || order.order_date)}
                      </td>
                      <td className="text-start ps-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-light rounded-circle p-2 me-2 flex-shrink-0"
                            style={{
                              width: 40,
                              height: 40,
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            👤
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {order.customer_name || "Khách vãng lai"}
                            </div>
                            <div className="small text-muted">
                              {order.phone || "---"}
                            </div>
                            <div
                              className="small text-muted text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={order.address}
                            >
                              📍 {order.address || "Tại cửa hàng"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-start">
                        {order.items ? (
                          <ul className="list-unstyled mb-0 small text-dark bg-light p-2 rounded border">
                            {order.items.split(", ").map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted fst-italic small">
                            Không có dữ liệu
                          </span>
                        )}
                      </td>
                      <td className="text-center fw-bold text-danger">
                        {formatPrice(order.totalPrice || order.total_amount)}
                      </td>
                      <td className="text-center">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="text-center">
                        {!isFinished ? (
                          <div className="d-flex flex-column gap-2">
                            {nextStatus && (
                              <button
                                className="btn btn-sm btn-success fw-bold shadow-sm"
                                onClick={() =>
                                  handleNextStep(order.id, currentStatus)
                                }
                              >
                                ➜{" "}
                                {nextStatus === "shipping"
                                  ? "Giao hàng"
                                  : nextStatus === "completed"
                                  ? "Hoàn tất"
                                  : "Duyệt"}
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger shadow-sm"
                              onClick={() => handleCancel(order.id)}
                            >
                              Hủy đơn
                            </button>
                          </div>
                        ) : (
                          // [SỬA] Thêm nội dung cho badge khi đã đóng
                          <span className="badge bg-light text-secondary border px-3 py-2"></span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Chưa có đơn hàng nào.
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

export default OrderManager;
