const db = require("../config/db");

class Review {
  static async getReviewByBookId(bookId) {
    const sql = `
        SELECT 
            r.id,
            r.user_id,
            r.book_id,
            r.rating,
            r.comment,
            r.created_at,
            u.fullname AS user_name
            FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.book_id = ?  
        ORDER BY r.created_at DESC`;
    const [rows] = await db.query(sql, [bookId]);
    return rows;
  }

  static async create(data) {
    const sql = `
        INSERT INTO reviews (user, book, rating, comment, is_visible) 
        VALUES (?, ?, ?, ?, 1)
    `;
    const [result] = await db.query(sql, [
      data.user,
      data.book,
      data.rating,
      data.comment,
    ]);
    return result.insertId;
  }
}

module.exports = Review;
