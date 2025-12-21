import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function login(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    // axios trả lỗi vào error.response
    const message = error.response?.data?.message || "Đăng nhập thất bại";
    throw new Error(message);
  }
}

export default {
  login,
};
