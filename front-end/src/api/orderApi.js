import api from "./api";

// 2. Định nghĩa các hàm nghiệp vụ
export async function fetchOrders() {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lấy danh sách đơn hàng thất bại";
    throw new Error(message);
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Cập nhật trạng thái đơn hàng thất bại";
    throw new Error(message);
  }
}

export async function createOrder(payload) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await api.post("/orders", payload, { headers });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại";
    throw new Error(message);
  }
}

export async function getOrderHistory(status) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await api.get("/orders/history", {
      params: status ? { status } : {},
      headers,
    });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Không tải được lịch sử đơn hàng";
    throw new Error(message);
  }
}

export async function cancelOrder(orderId) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await api.post(`/orders/${orderId}/cancel`, {}, { headers });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Hủy đơn hàng thất bại";
    throw new Error(message);
  }
}

export default {
  fetchOrders,
  updateOrderStatus,
  createOrder,
  getOrderHistory,
  cancelOrder,
};
