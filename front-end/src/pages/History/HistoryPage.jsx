import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./history.css";
import Header from "../../components/Header"; // Đảm bảo đường dẫn đúng
import {
  SearchOutlined,
} from "@ant-design/icons";
export default function HistoryPage({ user }) {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]); // Giả sử lấy từ API
  const navigate = useNavigate();

  const tabs = [
    { id: "all", label: "Tất cả đơn" },
    { id: "pending", label: "Chờ thanh toán" },
    { id: "processing", label: "Đang xử lý" },
    { id: "shipping", label: "Đang vận chuyển" },
    { id: "delivered", label: "Đã giao" },
    { id: "cancelled", label: "Đã huỷ" },
  ];

  // Nếu chưa đăng nhập thì không cho xem lịch sử
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="history-page-wrapper">
      <Header user={user} />
      
      <div className="history-container">
        <h2 className="history-title">Đơn hàng của tôi</h2>

        {/* Thanh Tabs điều hướng */}
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

        {/* Thanh tìm kiếm đơn hàng */}
        <div className="history-search-bar">
          <div className="search-input-wrapper">
            <SearchOutlined />
            <input 
              type="text" 
              placeholder="Tìm đơn hàng theo Mã đơn hàng, Nhà bán hoặc Tên sản phẩm" 
            />
          </div>
          <button className="btn-search-order">Tìm đơn hàng</button>
        </div>

        {/* Nội dung danh sách đơn hàng */}
        <div className="history-content-card">
          {orders.length === 0 ? (
            <div className="empty-order-state">
              <div className="empty-icon-wrapper">
                {/* Icon minh họa giống trong ảnh */}
                <img 
                  src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png" 
                  alt="No orders" 
                />
              </div>
              <p>Chưa có đơn hàng</p>
            </div>
          ) : (
            <div className="order-list">
              {/* Logic hiển thị danh sách đơn hàng nếu orders.length > 0 */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}