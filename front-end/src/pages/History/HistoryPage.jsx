import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { message, Tag, Spin, Empty } from "antd";
import { getOrderHistory, cancelOrder } from "../../api/orderApi";
import {
  ShoppingOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./history.css";

export default function HistoryPage({ user }) {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const tabs = [
    { id: "all", label: "Tất cả đơn" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "processing", label: "Đang xử lý" },
    { id: "shipping", label: "Đang giao" },
    { id: "completed", label: "Đã giao" },
    { id: "cancelled", label: "Đã huỷ" },
  ];

  const statusConfig = {
    pending: {
      color: "orange",
      icon: <ClockCircleOutlined />,
      text: "Chờ xác nhận",
    },
    processing: {
      color: "blue",
      icon: <SyncOutlined spin />,
      text: "Đang xử lý",
    },
    shipping: { color: "purple", icon: <CarOutlined />, text: "Đang giao" },
    completed: {
      color: "green",
      icon: <CheckCircleOutlined />,
      text: "Hoàn thành",
    },
    cancelled: { color: "red", icon: <CloseCircleOutlined />, text: "Đã hủy" },
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const status = activeTab === "all" ? undefined : activeTab;
      const data = await getOrderHistory(status);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const term = search.toLowerCase();
    return orders.filter((o) =>
      [
        o.order_id,
        o.shipping_address,
        ...(o.items || []).map((i) => i.book_name),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [orders, search]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(val || 0));

  const handleCancel = async (orderId) => {
    if (!window.confirm("Xác nhận hủy đơn hàng này?")) return;
    try {
      await cancelOrder(orderId);
      message.success("Đã hủy đơn hàng");
      fetchData();
    } catch (err) {
      message.error(err.message || "Không thể hủy đơn");
    }
  };

  return (
    <div className="history-page-bg">
      <Header />
      <div className="container py-4">
        <div className="history-main-content">
          <h4 className="fw-bold mb-4 text-uppercase color-primary">
            <ShoppingOutlined className="me-2" /> Lịch sử mua hàng
          </h4>

          {/* Tab Menu */}
          <div className="history-tabs-scroll mb-4">
            <div className="d-flex bg-white shadow-sm rounded">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex-fill text-center py-3 history-tab-btn ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="input-group mb-4 shadow-sm rounded overflow-hidden">
            <span className="input-group-text bg-white border-0 ps-3">
              <SearchOutlined className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 py-2 shadow-none"
              placeholder="Tìm theo mã đơn hoặc tên sách..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Order List */}
          <div className="order-list-container">
            {loading ? (
              <div className="text-center py-5 bg-white rounded">
                <Spin tip="Đang tải..." />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white py-5 rounded">
                <Empty description="Bạn chưa có đơn hàng nào" />
              </div>
            ) : (
              filteredOrders.map((order) => {
                const config = statusConfig[order.status.toLowerCase()] || {};
                return (
                  <div
                    key={order.order_id}
                    className="card border-0 shadow-sm mb-4 order-card"
                  >
                    {/* Card Header */}
                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold me-3">
                          MÃ ĐƠN: #{order.order_id}
                        </span>
                        <small className="text-muted">
                          <CalendarOutlined />{" "}
                          {new Date(order.order_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </small>
                      </div>
                      <Tag
                        icon={config.icon}
                        color={config.color}
                        className="m-0 px-3 py-1"
                      >
                        {config.text?.toUpperCase()}
                      </Tag>
                    </div>

                    {/* Receiver Info */}
                    <div className="card-body bg-light-gray border-bottom py-2 px-3">
                      <div className="row small text-muted">
                        <div className="col-md-4">
                          <UserOutlined className="me-1" />{" "}
                          <strong>Khách hàng:</strong> {user?.fullname}
                        </div>
                        <div className="col-md-3">
                          <PhoneOutlined className="me-1" />{" "}
                          <strong>SĐT:</strong> {user?.phone_number}
                        </div>
                        <div className="col-md-5">
                          <EnvironmentOutlined className="me-1" />{" "}
                          <strong>Địa chỉ:</strong> {user?.address}
                        </div>
                      </div>
                    </div>

                    {/* Book Items */}
                    <div className="card-body p-3">
                      {(order.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="d-flex gap-3 mb-3 pb-3 border-bottom-dashed"
                        >
                          <img
                            src={
                              item.book_image &&
                              item.book_image.startsWith("http")
                                ? item.book_image
                                : `http://localhost:3000/${item.book_image}`
                            }
                            alt={item.book_name}
                            className="rounded shadow-sm"
                            style={{
                              width: "65px",
                              height: "90px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/logo.jpg";
                            }}
                          />
                          <div className="flex-grow-1">
                            <h4 className="mb-1 fw-bold text-dark">
                              {item.book_name}
                            </h4>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="text-muted small">
                                Số lượng: x{item.quantity}
                              </span>
                              <span className="fw-bold text-primary">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted me-2">
                          Tổng thanh toán:
                        </span>
                        <span className="fs-5 fw-bold text-danger">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        {["pending", "processing"].includes(
                          order.status.toLowerCase()
                        ) && (
                          <button
                            className="btn btn-outline-danger btn-sm px-3"
                            onClick={() => handleCancel(order.order_id)}
                          >
                            Hủy đơn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
