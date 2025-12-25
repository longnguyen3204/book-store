import React, { useState, useEffect } from "react";
// Đảm bảo đường dẫn import đúng
import bannerApi from "../../api/bannerApi";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // State form nhập liệu
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    display_order: 0,
    image: null,
  });

  // URL Server để hiển thị ảnh
  const SERVER_URL = "http://localhost:3000";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Gọi API lấy tất cả banner (cho Admin)
      const response = await bannerApi.getAllBanners();
      const rawData = response.data || response;

      if (Array.isArray(rawData)) {
        // CHUẨN HÓA DỮ LIỆU: Đảm bảo field khớp với Frontend
        const normalizedData = rawData.map((item) => ({
          ...item,
          id: item.id || item._id, // Ưu tiên lấy id
          image: item.image_url || item.image, // Map image_url từ DB sang image
          link: item.link_url || item.link, // Map link_url từ DB sang link
        }));
        setBanners(normalizedData);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu banner:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
      display_order: 0,
      image: null,
    });
    setEditingBannerId(null);

    // Reset input file bằng DOM để xóa tên file đã chọn cũ
    const fileInput = document.getElementById("bannerImageInput");
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (banner) => {
    if (!banner.id) {
      alert("Lỗi: Banner này thiếu ID từ Server, không thể sửa!");
      return;
    }
    setEditingBannerId(banner.id);
    setShowForm(true);

    setFormData({
      title: banner.title || "",
      description: banner.description || "",
      link: banner.link || "",
      display_order: Number(banner.display_order) || 0,
      image: null, // Không set ảnh cũ vào input file, chỉ hiển thị ảnh preview nếu cần
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      if (formData.description)
        data.append("description", formData.description.trim());
      data.append("link", formData.link.trim());
      data.append("display_order", Number(formData.display_order) || 0);

      // Chỉ gửi ảnh nếu người dùng chọn file mới
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingBannerId) {
        await bannerApi.updateBanner(editingBannerId, data);
        alert("Cập nhật banner thành công!");
      } else {
        await bannerApi.createBanner(data);
        alert("Thêm banner mới thành công!");
      }

      resetForm();
      setShowForm(false);

      // Load lại dữ liệu ngay lập tức
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Thao tác thất bại");
    }
  };

  const handleToggleStatus = async (banner) => {
    if (!banner.id) {
      alert("Lỗi dữ liệu: Banner không có ID!");
      return;
    }

    // Kiểm tra trạng thái an toàn (ép kiểu về số để so sánh với 1)
    const isActive = Number(banner.is_active) === 1;
    const action = isActive ? "ẨN" : "HIỆN";

    if (
      !window.confirm(
        `Bạn có chắc muốn ${action} banner "${banner.title}" không?`
      )
    ) {
      return;
    }

    try {
      if (isActive) {
        await bannerApi.deleteBanner(banner.id); // Gọi API ẩn
      } else {
        await bannerApi.restoreBanner(banner.id); // Gọi API hiện
      }
      // Load lại dữ liệu ngay lập tức
      await loadData();
    } catch (error) {
      console.error(`Lỗi khi ${action} banner:`, error);
      alert(`Không thể thực hiện thao tác. Vui lòng thử lại.`);
    }
  };

  // Helper xử lý đường dẫn ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    // Xử lý dấu gạch chéo ngược từ Windows path
    return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
  };

  return (
    <div
      className="container-fluid py-4 bg-light"
      style={{ minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded shadow-sm">
        <h3 className="fw-bold text-uppercase text-primary m-0">
          QUẢN LÝ BANNER
        </h3>
        <span className="badge bg-primary fs-6 rounded-pill px-4 py-2">
          Tổng số: {banners.length}
        </span>
      </div>

      {/* TOOLBAR */}
      <div className="mb-3">
        <button
          className="btn btn-success shadow-sm fw-bold px-4"
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "ĐÓNG FORM" : "THÊM BANNER MỚI"}
        </button>
      </div>

      {/* FORM NHẬP LIỆU */}
      {showForm && (
        <div className="admin-card mb-4 p-4 border rounded bg-white shadow-sm border-2">
          <h4 className="fw-bold mb-4 text-dark">
            {editingBannerId ? "CẬP NHẬT BANNER" : "THÊM BANNER MỚI"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="small fw-bold">Tiêu đề Banner</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ví dụ: Khuyến mãi Mùa Hè"
                />
              </div>

              <div className="col-md-6">
                <label className="small fw-bold">Link liên kết</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="/san-pham/ao-thun hoặc https://..."
                />
              </div>

              <div className="col-md-6">
                <label className="small fw-bold">Hình ảnh</label>
                <input
                  id="bannerImageInput"
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  required={!editingBannerId}
                />
                {editingBannerId && (
                  <small className="text-muted fst-italic d-block mt-1">
                    * Bỏ trống nếu không muốn thay đổi ảnh cũ
                  </small>
                )}
              </div>

              <div className="col-md-6">
                <label className="small fw-bold">Thứ tự hiển thị</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: e.target.value })
                  }
                  placeholder="Số nhỏ hiển thị trước (VD: 1)"
                />
              </div>

              <div className="col-12">
                <label className="small fw-bold">Mô tả ngắn</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-4 text-end">
              <button
                type="submit"
                className="btn btn-primary px-5 me-2 fw-bold shadow-sm"
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

      {/* DANH SÁCH BANNER (TABLE) */}
      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle table-bordered mb-0 text-center">
          <thead className="bg-light text-dark fw-bold">
            <tr>
              <th className="py-3 text-center" style={{ width: "200px" }}>
                Hình ảnh
              </th>
              <th className="py-3 text-center">Thông tin Banner</th>
              <th className="py-3 text-center" style={{ width: "180px" }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                <tr key={banner.id || `temp-${index}`}>
                  <td>
                    {banner.image ? (
                      <img
                        src={getImageUrl(banner.image)}
                        alt={banner.title}
                        className="rounded border shadow-sm"
                        style={{
                          width: "140px",
                          height: "80px",
                          margin: "5px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-muted small">Không có ảnh</span>
                    )}
                  </td>
                  <td className="text-start px-3">
                    <div className="fw-bold text-primary fs-6">
                      {banner.title || "Chưa có tiêu đề"}
                    </div>
                    <div className="small text-muted">{banner.description}</div>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2 fw-bold"
                      onClick={() => handleEdit(banner)}
                    >
                      SỬA
                    </button>
                    <button
                      className={`btn btn-sm fw-bold ${
                        Number(banner.is_active) === 1
                          ? "btn-outline-danger" // Nếu đang hiện -> Nút đỏ (Ẩn)
                          : "btn-outline-success" // Nếu đang ẩn -> Nút xanh (Hiện)
                      }`}
                      onClick={() => handleToggleStatus(banner)}
                    >
                      {Number(banner.is_active) === 1 ? "ẨN" : "HIỆN"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-muted">
                  Chưa có banner nào. Hãy thêm mới!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerManager;
