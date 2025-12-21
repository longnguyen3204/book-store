import axios from "axios";
import { allBooks } from "../data/content";
import defaultImg from "../assets/images/default.png";

// Nạp tất cả ảnh tĩnh trong src/assets/images để fallback theo id
const staticImages = import.meta.glob("../assets/images/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const normText = (val) =>
  typeof val === "string" ? val.normalize("NFC") : val;

const imageFor = (book) => {
  if (book.image || book.thumbnail) return book.image || book.thumbnail;
  // fallback: tìm file có tên <id>.* trong assets/images (jpg/jpeg/png/webp)
  if (book.id) {
    const suffixes = [".jpg", ".jpeg", ".png", ".webp"];
    const match = Object.entries(staticImages).find(([path]) =>
      suffixes.some((ext) => path.endsWith(`/${book.id}${ext}`))
    );
    if (match) return match[1];
  }
  return defaultImg;
};

const normalizeBook = (book = {}) => ({
  id: book.id ?? book.bookId ?? book.book_id,
  title: normText(book.title || book.name || "No title"),
  author: normText(book.author || book.author_name || "Unknown"),
  price: book.price ?? book.original_price ?? book.sale_price ?? 0,
  prevPrice: book.original_price || book.prevPrice,
  image: imageFor(book),
  description: normText(book.description || book.descriptionProduct),
  ...book,
});

export const listProduct = async (params = {}) => {
  try {
    const { data } = await api.get("/books", { params });
    if (Array.isArray(data)) {
      return data.map(normalizeBook);
    }
    return [];
  } catch (err) {
    // Fallback dữ liệu mock nếu backend không phản hồi
    return allBooks.map(normalizeBook);
  }
};

export const productDetail = async (id) => {
  try {
    const { data } = await api.get(`/books/${id}`);
    return { metadata: { product: normalizeBook(data) } };
  } catch (err) {
    const fallback = allBooks.find((p) => p.id === Number(id));
    return { metadata: { product: fallback ? normalizeBook(fallback) : null } };
  }
};
