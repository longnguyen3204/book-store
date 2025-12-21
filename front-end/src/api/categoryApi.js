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

export default {
  fetchCategories,
};
