import React, { useState, useEffect } from "react";
import voucherApi from "../../api/voucherApi";

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [editingVoucherId, setEditingVoucherId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percent",
    discount_value: "",
    min_order_value: 0,
    quantity: 100,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await voucherApi.fetchVouchers();
      setVouchers(data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu voucher:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percent",
      discount_value: "",
      min_order_value: 0,
      quantity: 100,
      start_date: "",
      end_date: "",
    });
    setEditingVoucherId(null);
  };

  const handleEdit = (voucher) => {
    setEditingVoucherId(voucher.id);
    setShowForm(true);

    // Chuyển đổi định dạng ngày để hiển thị trong input datetime-local (YYYY-MM-DDThh:mm)
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toISOString().slice(0, 16);
    };

    setFormData({
      code: voucher.code || "",
      discount_type: voucher.discount_type || "percent",
      discount_value: voucher.discount_value || "",
      min_order_value: voucher.min_order_value || 0,
      quantity: voucher.quantity || 0,
      start_date: formatDate(voucher.start_date),
      end_date: formatDate(voucher.end_date),
    });
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVoucherId) {
        await voucherApi.updateVoucher(editingVoucherId, formData);
        alert("Cập nhật mã giảm giá thành công!");
      } else {
        await voucherApi.addVoucher(formData);
        alert("Thêm mã giảm giá mới thành công!");
      }

      resetForm();
      setShowForm(false);
      await loadData();
    } catch (err) {
      alert(err.message || "Thao tác thất bại");
    }
  };

  return (
    <div
      className="container-fluid py-4 bg-light"
      style={{ minHeight: "100vh" }}
    >
      {/* 1. THANH TIÊU ĐỀ */}
      <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded shadow-sm">
        <h3 className="fw-bold text-uppercase text-primary m-0">
          <i className="bi bi-ticket-perforated me-2"></i> QUẢN LÝ VOUCHER
        </h3>
        <span className="badge bg-primary fs-6 rounded-pill px-4 py-2">
          Tổng số mã: {vouchers.length}
        </span>
      </div>

      {/* 2. NÚT BẤM THÊM MỚI */}
      <div className="mb-3">
        <button
          className="btn btn-success shadow-sm fw-bold px-4"
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? (
            <>
              <i className="bi bi-x-circle me-1"></i> ĐÓNG FORM
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-1"></i> THÊM VOUCHER MỚI
            </>
          )}
        </button>
      </div>

      {/* 3. FORM NHẬP LIỆU */}
      {showForm && (
        <div className="admin-card mb-4 p-4 border rounded bg-white shadow-sm border-2">
          <h4 className="fw-bold mb-4 text-dark text-uppercase">
            {editingVoucherId
              ? "CẬP NHẬT THÔNG TIN VOUCHER"
              : "NHẬP THÔNG TIN VOUCHER MỚI"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="small fw-bold">Mã Voucher (Code)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold">Loại giảm giá</label>
                <select
                  className="form-select"
                  value={formData.discount_type}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_type: e.target.value })
                  }
                >
                  <option value="percent">Giảm theo %</option>
                  <option value="fixed">Giảm số tiền cố định</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="small fw-bold">Giá trị giảm</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Đơn tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.min_order_value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_value: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Số lượng phát hành</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Ngày bắt đầu</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Ngày hết hạn</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4 text-end">
              <button
                type="submit"
                className="btn btn-primary px-5 me-2 shadow fw-bold"
              >
                LƯU DỮ LIỆU
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4 fw-bold"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                HỦY
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. BẢNG DỮ LIỆU */}
      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle text-center table-bordered mb-0">
          <thead className="bg-light text-dark fw-bold text-uppercase small">
            <tr>
              <th className="py-3 text-center">Mã Voucher</th>
              <th className="text-center">Giảm Giá</th>
              <th className="text-center">Đơn Tối Thiểu</th>
              <th className="text-center">Sử Dụng</th>
              <th className="text-center">Hết Hạn</th>
              <th className="text-center">Trạng Thái</th>
              <th className="text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td className="fw-bold text-danger text-center">
                  {voucher.code}
                </td>
                <td className="fw-bold text-center">
                  {voucher.discount_type === "percent"
                    ? `${voucher.discount_value}%`
                    : `${Number(voucher.discount_value).toLocaleString()}đ`}
                </td>
                <td className="text-center">
                  {Number(voucher.min_order_value).toLocaleString()}đ
                </td>
                <td className="text-center">
                  <span className="text-primary fw-bold text-center">
                    {voucher.used_count || 0}
                  </span>
                  /{voucher.quantity}
                </td>
                <td className="small text-center">
                  {voucher.end_date
                    ? new Date(voucher.end_date).toLocaleDateString()
                    : "Hết Hạn"}
                </td>
                <td className="text-center">
                  {voucher.is_active ? (
                    <span className="badge bg-success">HOẠT ĐỘNG</span>
                  ) : (
                    <span className="badge bg-secondary text-black">ĐÃ ẨN</span>
                  )}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-warning btn-sm me-2 fw-bold"
                    onClick={() => handleEdit(voucher)}
                  >
                    SỬA
                  </button>
                  <button
                    className={`btn btn-sm fw-bold ${
                      voucher.is_active ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() =>
                      voucher.is_active
                        ? voucherApi.deleteVoucher(voucher.id).then(loadData)
                        : voucherApi.restoreVoucher(voucher.id).then(loadData)
                    }
                  >
                    {voucher.is_active ? "ẨN" : "HIỆN"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherManager;
