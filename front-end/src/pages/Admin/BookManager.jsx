import React, { useState, useEffect } from "react";
import bookApi from "../../api/bookApi";
import categoryApi from "../../api/categoryApi";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    description: "",
    price: "",
    category: "",
    image: null,
    sold_count: "",
    quantity: "",
    page_count: "",
    publish_year: "",
  });

  // load data books và categories khi component mount
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
      alert("Không tải được dữ liệu");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("sold_count", formData.sold_count);
    data.append("quantity", formData.quantity);
    data.append("page_count", formData.page_count);
    data.append("publish_year", formData.publish_year);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingBook) {
        await bookApi.updateBook(editingBook, data);
      } else {
        await bookApi.createBook(data);
      }
      alert("Thành công!");
      resetForm(); // Reset form after successful submit
      loadData();
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  // reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      author: "",
      description: "",
      price: "",
      category: "",
      image: null,
      sold_count: "",
      quantity: "",
      page_count: "",
      publish_year: "",
    });
    setEditingBook(null);
  };

  const handleEdit = (book) => {
    setEditingBook(book._id);
    setFormData({
      name: book.name,
      author: book.author,
      description: book.description,
      price: book.price,
      category: book.category?._id || book.category,
      image: null,
      sold_count: book.sold_count ?? 0,
      quantity: book.quantity ?? 0,
      page_count: book.page_count ?? "",
      publish_year: book.publish_year ?? "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn Ẩn?")) {
      try {
        await bookApi.deleteBook(id);
        loadData();
      } catch (err) {
        alert(err.message || "Không thể ẩn sách");
      }
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn hiển thị lại sách này?")) return;
    try {
      await bookApi.restoreBook(id);
      loadData();
    } catch (err) {
      alert(err.message || "Không thể hiện sách");
    }
  };

  return (
    <div>
      <h2>Quản lý Sách</h2>

      {/* Form Thêm/Sửa */}
      <form onSubmit={handleSubmit} className="mb-4 p-3 border bg-white">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Tên sách"
            className="form-control mb-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Tác giả"
            className="form-control"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            required
          />
        </div>

        <div className="row mb-2">
          <div className="col">
            <input
              type="number"
              placeholder="Giá"
              className="form-control"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div className="col">
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Chọn thể loại</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <input
              type="number"
              placeholder="Số lượng đã bán 0"
              className="form-control"
              value={formData.sold_count}
              disabled
            />
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Nhập số lượng còn lại"
              className="form-control"
              value={formData.quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (!isNaN(val) && val >= 0) {
                  setFormData({ ...formData, quantity: val });
                }
              }}
              required
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <input
              type="number"
              placeholder="Số trang"
              className="form-control"
              value={formData.page_count}
              onChange={(e) =>
                setFormData({ ...formData, page_count: e.target.value })
              }
            />
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Năm xuất bản"
              className="form-control"
              value={formData.publish_year}
              onChange={(e) =>
                setFormData({ ...formData, publish_year: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mb-2">
          <input
            type="file"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingBook ? "Cập nhật" : "Thêm mới"}
        </button>
        {editingBook && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách sách */}
      <table className="table table-bordered bg-white text-center" border="2">
        <thead>
          <tr>
            <th>Tên Sách</th>
            <th>Mô Tả</th>
            <th>Tác Giả</th>
            <th>Giá</th>
            <th>Đã Bán</th>
            <th>Còn Lại</th>
            <th>Số Trang</th>
            <th>Năm XB</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.name}</td>
              <td>{book.description}</td>
              <td>{book.author}</td>
              <td>{book.price}</td>
              <td>{book.sold_count ?? 0}</td>
              <td>{book.quantity ?? 0}</td>
              <td>{book.page_count ?? ""}</td>
              <td>{book.publish_year ?? ""}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(book)}
                >
                  Sửa
                </button>

                {book.is_active ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Ẩn
                  </button>
                ) : (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleRestore(book.id)}
                  >
                    Hiện
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookManager;
