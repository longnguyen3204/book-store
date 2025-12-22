import api from "./api";

export async function fetchCategories() {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lấy danh sách danh mục thất bại";
    throw new Error(message);
  }
}

export async function addCategory(categoryData) {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Thêm danh mục thất bại";
    throw new Error(message);
  }
}

export async function updateCategory(id, formData) {
  try {
    const response = await api.put(`/categories/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function delCategory(bookId) {
  try {
    const response = await api.delete(`/categories/${bookId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Ẩn sách thất bại";
    throw new Error(message);
  }
}

export default {
  fetchCategories,
  addCategory,
  updateCategory,
  delCategory,
};
