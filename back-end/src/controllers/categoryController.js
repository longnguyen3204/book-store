const Category = require("../models/Category");

// Hiển thị danh sách các thể loại hiện có
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Lỗi lấy danh sách thể loại:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm thể loại mới
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Vui lòng nhập tên thể loại!" });
    }

    const result = await Category.create({ name, description });

    res.status(201).json({
      message: "Thêm thể loại thành công!",
      categoryId: result.insertId, // Trả về ID của thể loại vừa tạo
    });
  } catch (error) {
    console.error("Lỗi thêm thể loại:", error);
    res.status(500).json({ message: "Lỗi Server khi thêm thể loại" });
  }
};

// Cập nhật thông tin thể loại
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id; // Lấy ID từ đường dẫn (số 1, 2...)
    const body = req.body || {}; // tránh lỗi destructure khi body undefined
    const { name, description } = body; // Chỉ nhận các trường hợp lệ

    // Kiểm tra id có phải số không
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "ID thể loại không hợp lệ." });
    }

    // Kiểm tra xem thể loại có tồn tại không
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cuốn thể loại này!" });
    }

    // Yêu cầu ít nhất một trường hợp lệ
    if (name === undefined && description === undefined) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp tên hoặc mô tả để cập nhật." });
    }

    // Chỉ cập nhật các trường hợp lệ, giữ nguyên phần còn lại
    const dataToUpdate = {
      name: name !== undefined ? name : existingCategory.name,
      description:
        description !== undefined ? description : existingCategory.description,
    };

    await Category.updateCategoryInfo(categoryId, dataToUpdate);

    res.json({ message: "Cập nhật thông tin thể loại thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật thông tin thể loại", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xem danh sách sách theo thể loại
exports.getCategoryBooks = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "ID thể loại không hợp lệ." });
    }

    // Kiểm tra xem thể loại có tồn tại không
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy thể loại này!" });
    }

    const books = await Category.getByCategory(categoryId);

    res.status(200).json(books);
  } catch (error) {
    console.error("Lỗi xem danh sách sách theo thể loại:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// Xóa thể loại
exports.delCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 1. Kiểm tra ID hợp lệ
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "ID thể loại không hợp lệ." });
    }

    // 2. Kiểm tra tồn tại trước khi cập nhật trạng thái
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Không tìm thấy thể loại này!" });
    }

    // Kiểm tra nếu nó đã bị ẩn rồi thì không cần làm lại
    if (existingCategory.is_active === 0) {
      return res
        .status(400)
        .json({ message: "Thể loại này đã được ẩn từ trước." });
    }

    // 3. Thực hiện cập nhật is_active = 0 (Xóa mềm)
    const result = await Category.delCategory(categoryId);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Thao tác thất bại, thể loại không tồn tại." });
    }

    // Trả về thông báo phù hợp với hành động ẨN
    res.json({ message: "Đã ẩn thể loại thành công!" });
  } catch (error) {
    // Khi dùng UPDATE, lỗi ER_ROW_IS_REFERENCED_2 sẽ không xảy ra
    // vì bản ghi cha vẫn tồn tại trong Database.
    console.error("Lỗi khi xử lý ẩn thể loại:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi thực hiện thao tác." });
  }
};
