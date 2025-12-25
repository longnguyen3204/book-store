import api from "./api";

// 1. Lấy tất cả banner
export async function getAllBanners() {
  try {
    const response = await api.get("/banner/hero-slides");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi tải danh sách");
  }
}

// 2. Lấy chi tiết một banner
export async function getBannerDetail(id) {
  try {
    const response = await api.get(`/banner/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Không tải được thông tin banner";
    throw new Error(message);
  }
}

// 3. Tạo mới banner
export async function createBanner(bannerData) {
  try {
    const response = await api.post("/banner", bannerData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Tạo banner thất bại");
  }
}

// 4. Cập nhật banner
export async function updateBanner(bannerId, bannerData) {
  try {
    const response = await api.put(`/banner/update/${bannerId}`, bannerData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Cập nhật banner thất bại"
    );
  }
}

// 5. Xóa (Ẩn) banner
export async function deleteBanner(bannerId) {
  try {
    const response = await api.delete(`/banner/${bannerId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Ẩn banner thất bại";
    throw new Error(message);
  }
}

// 6. Khôi phục (Hiện) banner
export async function restoreBanner(bannerId) {
  try {
    const response = await api.put(`/banner/${bannerId}/restore`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Hiện banner thất bại";
    throw new Error(message);
  }
}

export default {
  getAllBanners,
  getBannerDetail,
  createBanner,
  updateBanner,
  deleteBanner,
  restoreBanner,
};
