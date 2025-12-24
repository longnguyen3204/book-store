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
      role_id: newRole,
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

export async function updateProfile(data) {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const body = {
      fullname: data.fullname,
      phone_number: data.phone_number,
      address: data.address ?? null,
      avatar: data.avatar ?? null,
    };

    const response = await api.put("/users/profile", body, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật thất bại");
  }
}

export async function getProfile() {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await api.get("/users/profile", { headers });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không lấy được thông tin người dùng"
    );
  }
}

export default {
  getAllUsers,
  updateUserRole,
  updateLockStatus,
  updateProfile,
  getProfile,
};
