import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./history.css";
import Header from "../../components/Header";
import { message } from "antd";
import { getOrderHistory, cancelOrder } from "../../api/orderApi";

export default function HistoryPage({ user }) {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const tabs = [
    { id: "all", label: "Tất cả đơn" },
    { id: "pending", label: "Chờ thanh toán" },
    { id: "processing", label: "Đang xử lý" },
    { id: "shipping", label: "Đang vận chuyển" },
    { id: "completed", label: "Đã giao" },
    { id: "cancelled", label: "Đã huỷ" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const statusMap = {
          all: undefined,
          pending: "pending",
          processing: "processing",
          shipping: "shipping",
          completed: "completed",
          cancelled: "cancelled",
        };
        const status = statusMap[activeTab];
        const data = await getOrderHistory(status);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        message.error(err.message || "Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

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
    if (!orderId) return;
    if (!window.confirm("Bạn muốn hủy đơn hàng này?")) return;
    try {
      await cancelOrder(orderId);
      message.success("Đã hủy đơn hàng");
      const statusMap = {
        all: undefined,
        pending: "pending",
        processing: "processing",
        shipping: "shipping",
        completed: "completed",
        cancelled: "cancelled",
      };
      const status = statusMap[activeTab];
      const data = await getOrderHistory(status);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error(err.message || "Hủy đơn hàng thất bại");
    }
  };

  return (
    <div className="history-page-wrapper">
      <Header />
      <div className="history-container">
        <h2 className="history-title">Đơn hàng của tôi</h2>
        <div className="history-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="history-search-bar">
          <div className="search-input-wrapper">
            <span
              className="history-prefix-link"
              onClick={() => navigate("/order-history")}
            >
              Lịch sử mua hàng
            </span>
            <input
              type="text"
              placeholder="Tìm đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-search-order">Tìm đơn hàng</button>
        </div>
        <div className="history-content-card">
          {loading ? (
            <div className="empty-order-state">
              <p>Đang tải...</p>
            </div>
          ) : (
            <div className="order-list">
              {filteredOrders.map((order) => (
                <div key={order.order_id} className="order-card">
                  <div className="order-card-top">
                    <div className="order-code-status">
                      <span className="order-code">
                        Mã đơn: #{order.order_id}
                      </span>
                      <span className="order-status">{order.status}</span>
                    </div>
                    <div className="order-total-group">
                      <span className="order-total">
                        {formatCurrency(order.total_amount)}
                      </span>
                      {["pending", "processing", "shipping"].includes(
                        order.status
                      ) && (
                        <button
                          className="btn-cancel-order"
                          onClick={() => handleCancel(order.order_id)}
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="order-items">
                    {(order.items || []).map((it, idx) => (
                      <div
                        key={`${order.order_id}-${idx}`}
                        className="order-item-line"
                      >
                        <div className="order-item-info">
                          <div className="order-item-name">{it.book_name}</div>
                          {order.status === "completed" && (
                            <button
                              className="btn-review-item"
                              onClick={() =>
                                navigate(`/books/${it.book_id}`, {
                                  state: { openReview: true },
                                })
                              }
                              style={{
                                marginTop: "8px",
                                padding: "4px 10px",
                                backgroundColor: "#0b74e5",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
