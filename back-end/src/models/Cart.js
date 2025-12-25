const db = require("../config/db");

class Cart {
  static async findByUserId(userId) {
    const [rows] = await db.query("SELECT * FROM carts WHERE user_id = ?", [
      userId,
    ]);
    return rows[0];
  }

  static async create(userId) {
    const [result] = await db.query("INSERT INTO carts (user_id) VALUES (?)", [
      userId,
    ]);
    return { id: result.insertId, user_id: userId };
  }

  static async findOrCreateByUser(userId) {
    const cart = await this.findByUserId(userId);
    if (cart) return cart;
    return this.create(userId);
  }

  static async getItems(cartId) {
    const sql = `
            SELECT 
                ci.book_id,
                ci.quantity,
                b.name,
                b.original_price, -- chỉ hiển thị giá gốc; giá thanh toán tính ở checkout
                b.quantity AS stock
            FROM cart_items ci
            JOIN books b ON ci.book_id = b.id
            WHERE ci.cart_id = ?
            ORDER BY ci.updated_at DESC
        `;
    const [rows] = await db.query(sql, [cartId]);
    return rows;
  }

  static async getItem(cartId, bookId) {
    const [rows] = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND book_id = ?",
      [cartId, bookId]
    );
    return rows[0];
  }

  // Lấy item kèm giá để tính tổng
  static async getItemsForTotal(cartId, bookIds = []) {
    let filter = "";
    const params = [cartId];
    if (Array.isArray(bookIds) && bookIds.length > 0) {
      filter = " AND ci.book_id IN (?)";
      params.push(bookIds);
    }

    const sql = `
            SELECT 
                ci.book_id,
                ci.quantity,
                b.price,
                b.original_price,
                b.quantity AS stock
            FROM cart_items ci
            JOIN books b ON ci.book_id = b.id
            WHERE ci.cart_id = ? ${filter}
            ORDER BY ci.updated_at DESC
        `;
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async addItem(cartId, bookId, quantity) {
    const sql = `
            INSERT INTO cart_items (cart_id, book_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;
    await db.query(sql, [cartId, bookId, quantity]);
  }

  static async updateItemQuantity(cartId, bookId, quantity) {
    const sql = `
            UPDATE cart_items
            SET quantity = ?, updated_at = CURRENT_TIMESTAMP
            WHERE cart_id = ? AND book_id = ?
        `;
    const [result] = await db.query(sql, [quantity, cartId, bookId]);
    return result;
  }

  static async removeItem(cartId, bookId) {
    await db.query("DELETE FROM cart_items WHERE cart_id = ? AND book_id = ?", [
      cartId,
      bookId,
    ]);
  }
}

module.exports = Cart;
