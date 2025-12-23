import React, { useState, useEffect } from "react";
import categoryApi from "../../api/categoryApi";

const CategoryManager = () => {
  // --- GIỮ NGUYÊN LOGIC CỦA BẠN ---
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.fetchCategories();
      // Đảm bảo lấy đúng mảng dữ liệu từ phản hồi
      setCategories(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  const handleEdit = (cat) => {
    const targetId = cat.id || cat._id;
    setEditingId(targetId);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
    });
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryApi.updateCategory(editingId, formData);
        alert("Cập nhật thông tin thể loại thành công!");
      } else {
        await categoryApi.addCategory(formData);
        alert("Thêm thể loại thành công!");
      }
      resetForm();
      loadCategories();
    } catch (err) {
      alert(
        "Thao tác thất bại: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa thể loại này?")) {
      try {
        // Gọi API xóa mềm (Backend thực hiện UPDATE is_active = 0)
        await categoryApi.delCategory(id);
        loadCategories();
      } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || "Không thể xóa"));
      }
    }
  };
  // --- KẾT THÚC LOGIC ---

  // --- PHẦN GIAO DIỆN MỚI (LAYOUT ĐỒNG BỘ) ---
  return (
    <div
      className="container-fluid py-4 bg-light"
      style={{ minHeight: "100vh" }}
    >
      {/* HEADER BLOCK */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
        <h3 className="fw-bold text-uppercase text-primary m-0">
          <i className="bi bi-grid-fill me-2"></i>Quản lý Danh mục
        </h3>
        <span className="badge bg-primary fs-6 rounded-pill px-4 py-2">
          Tổng số: {categories.length}
        </span>
      </div>

      <div className="row g-4">
        {/* --- CỘT TRÁI: FORM NHẬP LIỆU (CARD TRẮNG) --- */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="fw-bold text-primary m-0 text-uppercase small">
                {editingId ? "Cập nhật Danh mục" : "Thêm Danh mục mới"}
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="fw-bold small text-uppercase text-dark mb-1">
                    Tên danh mục <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Nhập tên danh mục..."
                  />
                </div>
                <div className="mb-4">
                  <label className="fw-bold small text-uppercase text-dark mb-1">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Nhập mô tả..."
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold shadow-sm"
                  >
                    {editingId ? "LƯU DỮ LIỆU" : "THÊM MỚI"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      HỦY BỎ
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: BẢNG DANH SÁCH (CARD TRẮNG) --- */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light text-dark text-uppercase small fw-bold text-center border-bottom">
                  <tr>
                    <th
                      className="py-3 text-center ps-4"
                      style={{ width: "30%" }}
                    >
                      Tên danh mục
                    </th>
                    <th className="py-3 text-center" style={{ width: "50%" }}>
                      Mô tả
                    </th>
                    <th className="py-3 text-center" style={{ width: "20%" }}>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-5 text-center text-dark">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.id || cat._id} className="border-bottom">
                        <td className="text-start ps-4 fw-bold text-dark">
                          {cat.name}
                        </td>
                        <td className="text-start text-muted small">
                          {cat.description || "Chưa có mô tả"}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-warning me-2 shadow-sm"
                            onClick={() => handleEdit(cat)}
                          >
                            <b className="bi bi-pencil">Sửa</b>
                          </button>
                          <button
                            className="btn btn-sm btn-danger shadow-sm"
                            onClick={() => handleDelete(cat.id || cat._id)}
                          >
                            <b className="bi bi-trash">Xóa</b>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-5 text-center text-muted">
                        Chưa có danh mục nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
