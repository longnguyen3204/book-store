const db = require("../config/db");

class Category {
  // Hàm tìm Category bằng id
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return rows[0]; // Trả về Category tìm thấy, hoặc undefined nếu không có
  }

  // Hàm lấy tất cả các thể loại
  static async getAll() {
    const [rows] = await db.query(
      "SELECT id, name, description FROM categories WHERE is_activity = 1"
    );
    return rows;
  }

  // Hàm lấy các sách thuộc thể loại đó
  static async getByCategory(id) {
    const [rows] = await db.query(
      "SELECT b.* FROM books b JOIN book_categories bc ON b.id = bc.book_id WHERE bc.category_id = ? AND bc.is_activity = 1",
      [id]
    );
    return rows;
  }

  // Hàm tạo Category mới
  static async create(categoryInfo) {
    const { name, description } = categoryInfo;

    const sql = `INSERT INTO categories (name, description) VALUES (?, ?)`;

    // Thực thi lệnh insert
    const [result] = await db.query(sql, [name, description]);

    // result.insertId chính là ID của dòng vừa tạo
    return {
      id: result.insertId,
      name: name,
      description: description,
    };
  }

  // Cập nhật thể loại
  static async updateCategoryInfo(id, data) {
    const { name, description } = data;
    const sql = `UPDATE categories SET name = ?, description = ? WHERE id = ?`;
    await db.query(sql, [name, description, id]);
  }

  // Hàm xóa thể loại
  static async delCategory(id) {
    // Đảm bảo có dấu ngoặc vuông [result]
    const [result] = await db.query(
      "UPDATE categories SET is_activity = 0 WHERE id = ?",
      [id]
    );
    return result;
  }
}
module.exports = Category;
