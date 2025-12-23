const Book = require("../models/Book");
const multer = require("multer");

//Hiển thị danh sách các sách hiện có
exports.getBooks = async (req, res) => {
  try {
    const { author, publisher, year, category, category_id, sort, ...rest } =
      req.query;
    // Nếu có tham số lạ -> trả lỗi để tránh hiểu nhầm
    const allowedKeys = [
      "author",
      "publisher",
      "year",
      "category",
      "category_id",
      "sort",
    ];
    const extraKeys = Object.keys(rest || {});
    if (extraKeys.length) {
      return res
        .status(400)
        .json({ message: `Tham số không hỗ trợ: ${extraKeys.join(", ")}` });
    }

    if (year && isNaN(Number(year))) {
      return res.status(400).json({ message: "Năm xuất bản phải là số." });
    }

    if (category_id && isNaN(Number(category_id))) {
      return res.status(400).json({ message: "category_id phải là số." });
    }

    if (sort && !["price_asc", "price_desc"].includes(sort)) {
      return res
        .status(400)
        .json({ message: "sort chỉ hỗ trợ: price_asc, price_desc" });
    }

    const hasFilter = author || publisher || year || category || category_id;
    const useSearch = hasFilter || !!sort; // dùng search nếu có filter hoặc cần sắp xếp

    const books = useSearch
      ? await Book.search({
          author,
          publisher,
          publish_year: year ? Number(year) : undefined,
          category,
          category_id: category_id ? Number(category_id) : undefined,
          sort,
        })
      : await Book.getAll();
    res.status(200).json(books);
  } catch (error) {
    console.error("Lỗi lấy danh sách sách:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.addBook = async (req, res) => {
  try {
    const b = req.body;
    const bookData = {
      name: b.name,
      author_id: parseInt(b.author_id, 10) || null,
      publisher_id: parseInt(b.publisher_id, 10) || null,
      category_id: parseInt(b.category_id, 10) || null,
      quantity: parseInt(b.quantity, 10) || 0,
      isbn: b.isbn,
      description: b.description,
      original_price: parseFloat(b.original_price) || 0,
      price: parseFloat(b.price) || 0,
      publish_year: parseInt(b.publish_year, 10) || null,
      language: b.language,
      weight: b.weight,
      size: b.size,
      page_count: parseInt(b.page_count, 10) || null,
    };

    // TÍCH HỢP ẢNH: Lấy đường dẫn file từ Multer
    if (req.file) {
      bookData.image = req.file.path;
    }

    const result = await Book.create(bookData);
    res
      .status(201)
      .json({ message: "Thêm sách thành công!", bookId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// Cập nhật sách
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const existingBook = await Book.findById(bookId);
    if (!existingBook)
      return res.status(404).json({ message: "Không tìm thấy!" });

    const b = req.body;
    const dataToUpdate = {
      name: b.name || existingBook.name,
      publisher_id: b.publisher_id
        ? parseInt(b.publisher_id, 10)
        : existingBook.publisher_id,
      category_id: b.category_id
        ? parseInt(b.category_id, 10)
        : existingBook.category_id,
      author_id: b.author_id
        ? parseInt(b.author_id, 10)
        : existingBook.author_id,
      quantity:
        b.quantity !== undefined
          ? parseInt(b.quantity, 10)
          : existingBook.quantity,
      sold_count:
        b.sold_count !== undefined
          ? parseInt(b.sold_count, 10)
          : existingBook.sold_count,
      original_price: b.original_price
        ? parseFloat(b.original_price)
        : existingBook.original_price,
      price: b.price ? parseFloat(b.price) : existingBook.price,
      publish_year: b.publish_year
        ? parseInt(b.publish_year, 10)
        : existingBook.publish_year,
      page_count: b.page_count
        ? parseInt(b.page_count, 10)
        : existingBook.page_count,
      description: b.description || existingBook.description,
    };

    // TÍCH HỢP ẢNH: Lấy đường dẫn file mới nếu có
    if (req.file) {
      dataToUpdate.image = req.file.path;
    }

    await Book.updateBookInfo(bookId, dataToUpdate);
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Xem thông tin chi tiết của 1 quyển sách
exports.getBookDetail = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "ID sách không hợp lệ." });
    }

    // Kiểm tra xem sách có tồn tại không
    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return res.status(404).json({ message: "Không tìm thấy cuốn sách này!" });
    }

    res.status(200).json(existingBook);
  } catch (error) {
    console.error("Lỗi xem chi tiết sách:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// Xóa sách
exports.delBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "ID sách không hợp lệ." });
    }

    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return res.status(404).json({ message: "Không tìm thấy cuốn sách này!" });
    }

    await Book.delBook(bookId);

    res.json({ message: "Xóa sách thành công!" });
  } catch (error) {
    console.error("Lỗi xóa sách", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Hiện sách
exports.restoreBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (isNaN(bookId)) {
      return res.status(400).json({ message: "ID sách không hợp lệ." });
    }
    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return res.status(404).json({ message: "Không tìm thấy cuốn sách này!" });
    }
    await Book.restoreBook(bookId);
    res.json({ message: "Hiện sách thành công!" });
  } catch (error) {
    console.error("Lỗi hiện sách", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
