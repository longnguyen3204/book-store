import api from "./api";

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

export const fetchBooks = getBooks;
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
export const fetchBookById = getBookDetail;

export async function createBook(bookData) {
  try {
    const response = await api.post("/books", bookData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Tạo sách thất bại");
  }
}

export async function updateBook(bookId, bookData) {
  try {
    const response = await api.put(`/books/${bookId}`, bookData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật sách thất bại");
  }
}
export async function deleteBook(bookId) {
  try {
    const response = await api.delete(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Ẩn sách thất bại";
    throw new Error(message);
  }
}

export async function restoreBook(bookId) {
  try {
    const response = await api.put(`/books/${bookId}/restore`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Hiện sách thất bại";
    throw new Error(message);
  }
}

export default {
  getBooks,
  getBookDetail,
  fetchBooks,
  fetchBookById,
  createBook,
  updateBook,
  deleteBook,
  restoreBook,
};
