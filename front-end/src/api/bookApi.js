import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getBooks(params = {}) {
  try {
    const response = await api.get("/books", { params });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Không tải được danh sách sách";
    throw new Error(message);
  }
}

export async function getBookDetail(id) {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Không tải được thông tin sách";
    throw new Error(message);
  }
}

export default {
  getBooks,
  getBookDetail,
};

