import api from "./api";

// 1. Lấy danh sách toàn bộ tác giả
export async function fetchAuthors() {
  try {
    const response = await api.get("/authors");
    // Trả về mảng dữ liệu (tùy vào cấu trúc Backend trả về response.data hoặc response.data.data)
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lấy danh sách tác giả thất bại";
    throw new Error(message);
  }
}

// 2. Thêm tác giả mới (Dùng khi người dùng nhập tên tác giả lạ)
export async function addAuthor(authorData) {
  try {
    // authorData thường là { name: "Tên tác giả" }
    const response = await api.post("/authors", authorData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Thêm tác giả thất bại";
    throw new Error(message);
  }
}

// 3. Cập nhật thông tin tác giả (Nếu cần dùng cho trang quản lý tác giả riêng)
export async function updateAuthor(id, formData) {
  try {
    const response = await api.put(`/authors/${id}`, formData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Cập nhật tác giả thất bại";
    throw new Error(message);
  }
}

export default {
  fetchAuthors,
  addAuthor,
  updateAuthor,
};
