import api from "./api";

//1 Lấy tất cả người dùng
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

// 3. Khóa hoặc Mở khóa user
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
export async function changePassword(data) {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await api.put("/users/change-password", data, { headers });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Đổi mật khẩu thất bại";
    throw new Error(message);
  }
}
export async function sendResetPin(data) {
  try {
    const response = await api.post("/users/send-reset-pin", data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Gửi mã PIN thất bại";
    throw new Error(message);
  }
}

// 8. Xác thực mã PIN
export async function verifyPin(data) {
  try {
    const response = await api.post("/users/verify-pin", data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Mã PIN không chính xác";
    throw new Error(message);
  }
}

// 9. Đặt lại mật khẩu mới
export async function resetPassword(data) {
  try {
    const response = await api.post("/users/reset-password", data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Đặt lại mật khẩu thất bại";
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
export default {
  getAllUsers,
  updateUserRole,
  updateLockStatus,
  updateProfile,
  getProfile,
  changePassword,
  sendResetPin,
  verifyPin,
  resetPassword,
};
