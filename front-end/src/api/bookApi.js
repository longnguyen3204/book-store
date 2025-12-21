import api from "./api";

export async function fetchBooks() {
  try {
    const response = await api.get("/books");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lấy danh sách sách thất bại";
    throw new Error(message);
  }
}

export async function fetchBookById(bookId) {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lấy thông tin sách thất bại";
    throw new Error(message);
  }
}
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
  fetchBooks,
  fetchBookById,
  createBook,
  updateBook,
  deleteBook,
  restoreBook,
};
