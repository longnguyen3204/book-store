const db = require("../config/db");

class BookImage {
  static async create(bookId, imageUrl, isThumbnail = 0) {
    const sql = `INSERT INTO book_images (book_id, image_url, is_thumbnail) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [bookId, imageUrl, isThumbnail]);
    return result;
  }

  static async getByBookId(bookId) {
    const sql = `SELECT * FROM book_images WHERE book_id = ? ORDER BY is_thumbnail DESC`;
    const [rows] = await db.query(sql, [bookId]);
    return rows;
  }

  static async setThumbnail(bookId, imageId) {
    await db.query(
      "UPDATE book_images SET is_thumbnail = 0 WHERE book_id = ?",
      [bookId]
    );

    const sql = "UPDATE book_images SET is_thumbnail = 1 WHERE id = ?";
    const [result] = await db.query(sql, [imageId]);
    return result;
  }
  static async delete(id) {
    const sql = `DELETE FROM book_images WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  }
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM book_images WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }
}

module.exports = BookImage;
