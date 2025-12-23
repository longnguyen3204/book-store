import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function createOrder(payload) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
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
    "Content-Type": "application/json",
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
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await api.post(`/orders/${orderId}/cancel`, {}, { headers });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Hủy đơn hàng thất bại";
    throw new Error(message);
  }
}

export default { createOrder };

