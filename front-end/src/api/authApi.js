import api from "./api";

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

export async function register(payload) {
  try {
    // Backend expect: fullname, email, password, phone_number (optional)
    const body = {
      fullname: payload.name,
      email: payload.email,
      password: payload.password,
      phone_number: payload.phone_number || null,
    };
    const response = await api.post("/auth/register", body);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Đăng ký thất bại";
    throw new Error(message);
  }
}

export default {
  login,
  register,
};
