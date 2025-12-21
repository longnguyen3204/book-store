import api from "./api";

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

export default {
  fetchOrders,
  updateOrderStatus,
};
