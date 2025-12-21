import api from "./api";

export async function getAllUsers() {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lấy danh sách người dùng thất bại";
    throw new Error(message);
  }
}
export async function updateUserRole(userId, newRole) {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, {
      role: newRole,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Cập nhật vai trò người dùng thất bại";
    throw new Error(message);
  }
}

export default {
  getAllUsers,
  updateUserRole,
};
