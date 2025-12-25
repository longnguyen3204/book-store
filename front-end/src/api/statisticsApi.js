import api from "./api";

// Lấy danh sách slide banner
export async function getHeroSlides() {
  try {
    const response = await api.get("/statistics/banner");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi tải banner");
  }
}

// Lấy sách nổi bật (Featured)
export async function getFeaturedBooks() {
  try {
    const response = await api.get("/statistics/featured_books", {
      params: { isFeatured: true, limit: 4 },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi tải sách nổi bật");
  }
}

// Lấy sách phổ biến theo Tab (Popular)
export async function getPopularBooks() {
  try {
    const response = await api.get("/statistics/popular-tabs");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi tải sách phổ biến");
  }
}

// Lấy sách bán chạy nhất (Best Selling - 1 cuốn duy nhất)
export async function getBestSellingBook() {
  try {
    const response = await api.get("/statistics/best-selling");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi tải sách bán chạy");
  }
}

// Lấy sách đang giảm giá (Special Offers)
export async function getSpecialOffers() {
  try {
    const response = await api.get("/statistics/special_offers", {
      params: { hasOffer: true },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi tải chương trình ưu đãi"
    );
  }
}

export default {
  getHeroSlides,
  getFeaturedBooks,
  getPopularBooks,
  getBestSellingBook,
  getSpecialOffers,
};
