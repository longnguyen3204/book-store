import React, { useState, useEffect, useMemo } from "react";
import bookApi from "../../api/bookApi";
import categoryApi from "../../api/categoryApi";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    description: "",
    price: "",
    categoryName: "",
    image: null,
    sold_count: 0,
    quantity: 0,
    page_count: "",
    publish_year: "",
  });

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      const id = c.id || c._id;
      if (id) map[id.toString()] = c.name;
    });
    return map;
  }, [categories]);

  const getCategoryName = (book) => {
    if (book.category_name) return book.category_name;
    if (book.category && typeof book.category === "object")
      return book.category.name;
    const targetId = book.category_id || book.categoryId || book.category;
    return categoryMap[targetId?.toString()] || "N/A";
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, categoriesData] = await Promise.all([
        bookApi.fetchBooks(),
        categoryApi.fetchCategories(),
      ]);
      setBooks(booksData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      author: "",
      description: "",
      price: "",
      categoryName: "",
      image: null,
      sold_count: 0,
      quantity: 0,
      page_count: "",
      publish_year: "",
    });
    setEditingBookId(null);
  };

  const handleEdit = (book) => {
    setEditingBookId(book.id || book._id);
    setShowForm(true); // Lấy tên thể loại để hiển thị lên form

    const currentCatName = getCategoryName(book);

    setFormData({
      name: book.name || "",
      author: book.author || "",
      description: book.description || "",
      price: book.price?.toString() || "", // Điền tên thể loại vào input, nếu là N/A thì để trống
      categoryName: currentCatName === "N/A" ? "" : currentCatName,
      image: null,
      sold_count: Number(book.sold_count) || 0,
      quantity: Number(book.quantity) || 0,
      page_count: book.page_count?.toString() || "",
      publish_year: book.publish_year?.toString() || "",
    });

    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let targetCategoryId = null;
      const inputCatName = (formData.categoryName || "").trim();
      const existingCategory = categories.find(
        (c) => c.name?.toLowerCase().trim() === inputCatName.toLowerCase()
      );

      if (existingCategory) {
        targetCategoryId = existingCategory.id || existingCategory._id;
      } else {
        const res = await categoryApi.addCategory({ name: inputCatName });
        const resData = res.data || res;
        targetCategoryId = resData.categoryId || resData.id;
        const updatedCats = await categoryApi.fetchCategories();
        setCategories(updatedCats);
      } // XỬ LÝ DỮ LIỆU SỐ TRƯỚC KHI GỬI

      const sendQuantity = parseInt(formData.quantity, 10);
      const sendPrice = parseInt(formData.price, 10);

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("author", formData.author.trim());
      data.append("description", formData.description.trim());
      data.append("price", isNaN(sendPrice) ? 0 : sendPrice);
      data.append("original_price", isNaN(sendPrice) ? 0 : sendPrice);
      data.append("category_id", targetCategoryId); // Ép kiểu chắc chắn không để trống

      data.append("quantity", isNaN(sendQuantity) ? 0 : sendQuantity);
      data.append("sold_count", Number(formData.sold_count) || 0);

      if (formData.page_count)
        data.append("page_count", Number(formData.page_count));
      if (formData.publish_year)
        data.append("publish_year", Number(formData.publish_year));
      if (formData.image) data.append("image", formData.image);

      if (editingBookId) {
        await bookApi.updateBook(editingBookId, data);
        alert("Cập nhật thành công!");
      } else {
        await bookApi.createBook(data);
        alert("Thêm mới thành công!");
      }

      resetForm();
      setShowForm(false);
      await loadData();
    } catch (err) {
      alert(err.message || "Thao tác thất bại");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-uppercase">Quản lý Kho Sách</h2>
        <button
          className="btn btn-success shadow-sm"
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Đóng form" : "Thêm sách mới"}
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border rounded bg-white shadow-sm border-2"
        >
          <h4 className="mb-3 text-primary fw-bold ">
            {editingBookId ? "Cập nhật sách" : "Thêm sách mới"}
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="small fw-bold">Tên sách</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <label className="small fw-bold">Tác giả</label>
              <input
                type="text"
                className="form-control"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <label className="small fw-bold">Thể loại</label>
              <input
                type="text"
                className="form-control"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                list="categoryList"
                required
              />
              <datalist id="categoryList">
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.name} />
                ))}
              </datalist>
            </div>
            <div className="col-md-3">
              <label className="small fw-bold">Giá bán</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            {/* INPUT QUANTITY TẬP TRUNG SỬA LỖI TẠI ĐÂY */}
            <div className="col-md-3">
              <label className="small fw-bold">Số lượng còn lại</label>
              <input
                type="number"
                className="form-control "
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                onWheel={(e) => e.target.blur()}
                required
              />
            </div>
            <div className="col-md-3 text-muted">
              <label className="small fw-bold">Số lượng đã bán</label>
              <input
                type="number"
                className="form-control bg-light"
                value={formData.sold_count}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold">Số trang</label>
              <input
                type="number"
                className="form-control"
                value={formData.page_count}
                onChange={(e) =>
                  setFormData({ ...formData, page_count: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold">Năm XB</label>
              <input
                type="number"
                className="form-control"
                value={formData.publish_year}
                onChange={(e) =>
                  setFormData({ ...formData, publish_year: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold">Hình ảnh</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                accept="image/*"
              />
            </div>
            <div className="col-12">
              <label className="small fw-bold">Mô tả</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary px-5 me-2 shadow">
              Lưu dữ liệu
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle text-center table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Tên Sách</th>
              <th className="text-center">Mô Tả</th>
              <th className="text-center">Tác Giả</th>
              <th className="text-center">Số Trang</th>
              <th className="text-center">Thể Loại</th>
              <th className="text-center">Giá</th>
              <th className="text-center">Đã Bán</th>
              <th className="text-center">Còn Lại</th>
              <th className="text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              // Ưu tiên lấy category_name từ SQL JOIN, nếu không có mới dùng getCategoryName cũ
              const displayCategory =
                book.category_name || getCategoryName(book);

              return (
                <tr key={book.id || book._id}>
                  <td className="fw-bold text-start">{book.name}</td>
                  <td className="fw-bold text-start">{book.description}</td>
                  <td className="fw-bold text-start">{book.author}</td>
                  <td className="fw-bold text-start">{book.page_count}</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {displayCategory}
                    </span>
                  </td>
                  <td className="text-danger fw-bold">
                    {Number(book.price).toLocaleString()}đ
                  </td>
                  <td>{book.sold_count || 0}</td>
                  {/* Đảm bảo hiển thị đúng trường quantity */}
                  <td className="fw-bold text-primary fs-5">
                    {book.quantity ?? 0}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => handleEdit(book)}
                    >
                      Sửa
                    </button>

                    <button
                      className={`btn btn-sm ${
                        book.is_active ? "btn-danger" : "btn-success"
                      }`}
                      onClick={() =>
                        book.is_active
                          ? bookApi
                              .deleteBook(book.id || book._id)
                              .then(loadData)
                          : bookApi
                              .restoreBook(book.id || book._id)
                              .then(loadData)
                      }
                    >
                      {book.is_active ? "Ẩn" : "Hiện"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookManager;
