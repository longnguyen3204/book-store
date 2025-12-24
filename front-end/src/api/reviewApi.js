import api from "./api";

export async function getReviewsByBook(bookId) {
  try {
    const response = await api.get(`/reviews/book/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi API chi tiết:", error.response || error);
    return [];
  }
}

// Gửi đánh giá mới
export async function createReview(payload) {
  try {
    const response = await api.post("/reviews", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gửi đánh giá thất bại");
  }
}
export default {
  createReview,
  getReviewsByBook,
};
