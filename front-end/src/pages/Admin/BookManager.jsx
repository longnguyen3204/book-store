import React, { useState, useEffect, useMemo } from "react";
import bookApi from "../../api/bookApi";
import categoryApi from "../../api/categoryApi";
import authorApi from "../../api/authorApi";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
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
    const targetId = book.category_id || book.categoryId || book.category;
    return categoryMap[targetId?.toString()] || "N/A";
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, categoriesData, authorsData] = await Promise.all([
        bookApi.fetchBooks(),
        categoryApi.fetchCategories(),
        authorApi.fetchAuthors(),
      ]);
      console.log(booksData, categoriesData);
      setBooks([...booksData]);
      setCategories(categoriesData);
      setAuthors(authorsData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
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
    setShowForm(true);

    const currentCatName = getCategoryName(book);

    setFormData({
      name: book.name || "",
      author: book.author || "",
      description: book.description || "",
      price: book.price?.toString() || "",
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
        targetCategoryId = resData.id || resData.categoryId;
        const updatedCats = await categoryApi.fetchCategories();
        setCategories(updatedCats);
      }

      let targetAuthorId = null;
      const inputAuthorName = (formData.author || "").trim();
      const existingAuthor = authors.find(
        (a) => a.name?.toLowerCase().trim() === inputAuthorName.toLowerCase()
      );
      if (existingAuthor) {
        targetAuthorId = existingAuthor.id || existingAuthor._id;
      } else {
        const res = await authorApi.addAuthor({ name: inputAuthorName });
        const resData = res.data || res;
        targetAuthorId = resData.id || resData.authorId;
        const updatedAuthors = await authorApi.fetchAuthors();
        setAuthors(updatedAuthors);
      }

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("author_id", targetAuthorId);
      data.append("description", formData.description.trim());
      data.append("price", Number(formData.price) || 0);
      data.append("category_id", targetCategoryId);
      data.append("quantity", Number(formData.quantity) || 0);
      data.append("page_count", Number(formData.page_count) || 0);
      data.append("publish_year", Number(formData.publish_year) || 0);

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
      setTimeout(() => {
        loadData();
      }, 300);
      await loadData();
    } catch (err) {
      alert(err.message || "Thao tác thất bại");
    }
  };
  const handleToggleStatus = async (book) => {
    const action = book.is_active ? "ẩn" : "hiện";
    if (
      !window.confirm(
        `Bạn có chắc muốn ${action} cuốn sách "${book.name}" không?`
      )
    ) {
      return;
    }

    try {
      if (book.is_active) {
        await bookApi.deleteBook(book.id);
      } else {
        await bookApi.restoreBook(book.id);
      }

      await loadData();
    } catch (error) {
      console.error(`Lỗi khi ${action} sách:`, error);
      alert(`Không thể ${action} sách. Vui lòng thử lại!`);
    }
  };
  return (
    <div
      className="container-fluid py-4 bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded shadow-sm">
        <h3 className="fw-bold text-uppercase text-primary m-0">
          QUẢN LÝ KHO SÁCH
        </h3>
        <span className="badge bg-primary fs-6 rounded-pill px-4 py-2">
          Tổng số sách: {books.length}
        </span>
      </div>

      <div className="mb-3">
        <button
          className="btn btn-success shadow-sm fw-bold px-4"
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "ĐÓNG FORM" : "THÊM SÁCH MỚI"}
        </button>
      </div>

      {showForm && (
        <div className="admin-card mb-4 p-4 border rounded bg-white shadow-sm border-2">
          <h4 className="fw-bold mb-4 text-dark">
            {editingBookId
              ? "CẬP NHẬT THÔNG TIN SÁCH"
              : "NHẬP THÔNG TIN SÁCH MỚI"}
          </h4>
          <form onSubmit={handleSubmit}>
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
                  list="authorList"
                  required
                />
                <datalist id="authorList">
                  {authors.map((auth) => (
                    <option key={auth.id} value={auth.name} />
                  ))}
                </datalist>
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
                    <option key={cat.id} value={cat.name} />
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
              <div className="col-md-3">
                <label className="small fw-bold">Số lượng tồn</label>
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
                <label className="small fw-bold">Năm xuất bản</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.publish_year}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_year: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
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
                <label className="small fw-bold">Mô tả nội dung</label>
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

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle text-center table-bordered mb-0">
          <thead className="bg-light text-dark fw-bold">
            <tr>
              <th className="py-3 text-center">Tên Sách</th>
              <th className="py-3 text-center">Mô Tả</th>
              <th className="py-3 text-center">Tác Giả</th>
              <th className="py-3 text-center">Thể Loại</th>
              <th className="py-3 text-center">Giá</th>
              <th className="py-3 text-center">Đã Bán</th>
              <th className="py-3 text-center">Còn Lại</th>
              <th className="py-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td className="fw-bold text-start ps-4">
                  <div className="d-flex align-items-center">
                    {book.image && (
                      <img
                        src={
                          book.image.startsWith("http")
                            ? book.image
                            : `http://localhost:3000/${book.image}`
                        }
                        alt={book.name}
                        className="rounded me-3 shadow-sm"
                        style={{
                          width: "40px",
                          height: "55px",
                          objectFit: "cover",
                          border: "1px solid #eee",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <span>{book.name}</span>
                  </div>
                </td>
                <td className="text-start">{book.description}</td>
                <td className="text-start">{book.author}</td>
                <td className=" text-center">
                  <span className="badge bg-info text-dark ">
                    {book.category_name || getCategoryName(book)}
                  </span>
                </td>
                <td className="text-danger fw-bold text-center">
                  {Number(book.price).toLocaleString()}đ
                </td>
                <td className="fw-bold text-primary  text-center">
                  {book.sold_count ?? 0}
                </td>
                <td className="fw-bold text-primary  text-center">
                  {book.quantity ?? 0}
                </td>
                <td className=" text-center">
                  <button
                    className="btn btn-warning btn-sm me-2 fw-bold "
                    onClick={() => handleEdit(book)}
                  >
                    SỬA
                  </button>
                  <button
                    className={`btn btn-sm fw-bold ${
                      book.is_active ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() =>
                      book.is_active
                        ? bookApi.deleteBook(book.id).then(loadData)
                        : bookApi.restoreBook(book.id).then(loadData)
                    }
                  >
                    {book.is_active ? "ẨN" : "HIỆN"}
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

export default BookManager;
