import api from "./api";

export async function getAllUsers() {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lấy danh sách người dùng thất bại";
    throw new Error(message);
  }
}
export async function updateUserRole(userId, newRole) {
  try {
    const response = await api.put(`/users/${userId}/role`, {
      role: newRole,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Cập nhật vai trò người dùng thất bại";
    throw new Error(message);
  }
}
// 3. Khóa hoặc Mở khóa user (Hàm mới bổ sung)
export async function updateLockStatus(userId, status) {
  try {
    const response = await api.put(`/users/${userId}/lock`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Cập nhật trạng thái tài khoản thất bại";
    throw new Error(message);
  }
}
export default {
  getAllUsers,
  updateUserRole,
  updateLockStatus,
};
