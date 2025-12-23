import api from "./api";

const voucherApi = {
  fetchVouchers: () => api.get("/vouchers").then((res) => res.data),
  addVoucher: (data) => api.post("/vouchers", data),
  updateVoucher: (id, data) => api.put(`/vouchers/${id}`, data),
  deleteVoucher: (id) => api.delete(`/vouchers/${id}`),
  restoreVoucher: (id) => api.patch(`/vouchers/${id}/restore`),
};

export default voucherApi;
