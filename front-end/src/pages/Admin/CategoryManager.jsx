// src/pages/Admin/BookManager.jsx
import React, { useState, useEffect } from "react";
import categoryApi from "../../api/categoryApi";
import bookApi from "../../api/bookApi";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null); // ID sách đang sửa
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookRes, catRes] = await Promise.all([
        bookApi.fetchBooks(),
        categoryApi.fetchCategories(),
      ]);
      setBooks(bookRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingBook) {
        await bookApi.updateBook(editingBook, data);
        alert("Cập nhật sách thành công!");
      } else {
        await bookApi.createBook(data);
        alert("Thêm sách mới thành công!");
      }

      // Reset form
      setFormData({ title: "", price: "", category: "", image: null });
      setEditingBook(null);

      // Reload data
      loadData();

      // Reset file input value (trick để xóa tên file cũ trên giao diện)
      document.getElementById("fileInput").value = "";
    } catch (err) {
      alert("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sách này?")) {
      try {
        await adminApi.deleteBook(id);
        loadData();
      } catch (error) {
        alert("Lỗi xóa sách");
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book._id);
    setFormData({
      title: book.title,
      price: book.price,
      category: book.category?._id || book.category, // Handle populated vs unpopulated category
      image: null,
    });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setFormData({ title: "", price: "", category: "", image: null });
    document.getElementById("fileInput").value = "";
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Quản lý Sách</h2>
        <span style={{ color: "#777" }}>Tổng số: {books.length} cuốn sách</span>
      </div>

      <div className="row">
        {/* --- CỘT TRÁI: FORM THÊM / SỬA --- */}
        <div className="col-md-4">
          <div className="admin-card">
            <h4
              className="mb-4"
              style={{
                color: "var(--admin-dark)",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              {editingBook ? "Cập nhật Sách" : "Thêm Sách mới"}
            </h4>

            <form onSubmit={handleSubmit}>
              {/* Tên sách */}
              <div className="mb-3">
                <label
                  className="form-label fw-bold text-secondary"
                  style={{ fontSize: "0.9rem" }}
                >
                  Tên sách
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên sách..."
                  className="admin-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Giá & Danh mục (Chung hàng) */}
              <div className="row">
                <div className="col-6 mb-3">
                  <label
                    className="form-label fw-bold text-secondary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Giá ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="admin-input"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label
                    className="form-label fw-bold text-secondary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Danh mục
                  </label>
                  <select
                    className="admin-input"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    style={{ backgroundImage: "none" }} // Fix icon mặc định của select
                  >
                    <option value="">Chọn...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ảnh bìa */}
              <div className="mb-4">
                <label
                  className="form-label fw-bold text-secondary"
                  style={{ fontSize: "0.9rem" }}
                >
                  Ảnh bìa
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="admin-input"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  style={{ padding: "6px" }}
                />
              </div>

              {/* Nút hành động */}
              <button
                type="submit"
                className="admin-btn admin-btn-primary w-100 py-2 mb-2"
              >
                {editingBook ? "Lưu thay đổi" : "+ Thêm Sách"}
              </button>

              {editingBook && (
                <button
                  type="button"
                  className="admin-btn w-100 py-2"
                  style={{ background: "#eee", color: "#555" }}
                  onClick={handleCancelEdit}
                >
                  Hủy bỏ
                </button>
              )}
            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH --- */}
        <div className="col-md-8">
          <div className="admin-card p-0 overflow-hidden">
            <div className="p-3 border-bottom bg-light">
              <h5 className="m-0 text-secondary">Danh sách hiện có</h5>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th style={{ width: "15%" }}>Giá</th>
                  <th style={{ width: "20%" }}>Danh mục</th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book._id}>
                      <td style={{ fontWeight: "500", color: "#333" }}>
                        {book.title}
                      </td>
                      <td className="text-muted">${book.price}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {book.category?.name || "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="text-center">
                        {/* Nút Sửa */}
                        <button
                          className="action-btn btn-edit"
                          onClick={() => handleEdit(book)}
                          title="Sửa"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {/* Nút Xóa */}
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(book._id)}
                          title="Xóa"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      Chưa có cuốn sách nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookManager;
