const db = require("../config/db");

class Author {
  // Lấy toàn bộ danh sách tác giả
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM authors");
    return rows;
  }

  // Tìm tác giả theo ID
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM authors WHERE id = ?", [id]);
    return rows[0];
  }

  // Tạo tác giả mới và trả về thông tin kèm ID mới
  static async create(authorData) {
    const { name, bio } = authorData;
    const sql = `INSERT INTO authors (name, bio) VALUES (?, ?)`;
    const [result] = await db.query(sql, [name, bio || null]);

    return {
      id: result.insertId,
      name: name,
      bio: bio,
    };
  }

  // Cập nhật thông tin tác giả
  static async update(id, data) {
    const { name, bio } = data;
    const sql = `UPDATE authors SET name = ?, bio = ? WHERE id = ?`;
    await db.query(sql, [name, bio, id]);
  }
}

module.exports = Author;
