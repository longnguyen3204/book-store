const db = require("../config/db");

class Voucher {
  static async getAll() {
    const sql = `
      SELECT v.*, 
      (SELECT COUNT(*) FROM orders o WHERE o.voucher_id = v.id) as used_count 
      FROM vouchers v 
      ORDER BY v.id DESC`;
    const [rows] = await db.query(sql);
    return rows;
  }
  static async getActive() {
    const sql = `SELECT v.*, COUNT(o.id) as used_count FROM vouchers v
    LEFT JOIN orders o ON v.id = o.voucher_id WHERE v.is_active = 1 
    GROUP BY v.id ORDER BY v.id DESC `;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM vouchers WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(data) {
    const sql = `INSERT INTO vouchers 
      (code, discount_type, discount_value, min_order_value, quantity, start_date, end_date, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      data.code,
      data.discount_type,
      data.discount_value,
      data.min_order_value || 0,
      data.quantity || 100,
      data.start_date || null,
      data.end_date || null,
      1,
    ];
    const [result] = await db.query(sql, params);
    return result;
  }

  static async update(id, data) {
    const { used_count, id: _, ...updateData } = data;
    const sql = `UPDATE vouchers SET ? WHERE id = ?`;
    const [result] = await db.query(sql, [updateData, id]);
    return result;
  }

  static async delete(id) {
    const sql = `UPDATE vouchers SET is_active = 0 WHERE id = ?`;
    return await db.query(sql, [id]);
  }

  // HÀM RESTORE Ở ĐÂY
  static async restore(id) {
    const sql = `UPDATE vouchers SET is_active = 1 WHERE id = ?`;
    return await db.query(sql, [id]);
  }

  static async findByCode(code) {
    const sql = `
      SELECT * FROM vouchers 
      WHERE code = ? 
      AND is_active = 1 
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW())
      LIMIT 1`;
    const [rows] = await db.query(sql, [code]);
    return rows[0];
  }
}

module.exports = Voucher;
