import api from "./api";

export async function getReviewsByBook(bookId) {
  try {
    const response = await api.get(`/reviews/book/${bookId}`);
    return response.data; // Giả sử trả về mảng các review
  } catch (error) {
    console.error("Lấy đánh giá thất bại", error);
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
