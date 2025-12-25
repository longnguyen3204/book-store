const db = require("../config/db"); // Đường dẫn đến file cấu hình connect DB

class BannerModel {
  static async getAll() {
    const sql = "SELECT * FROM banners ORDER BY display_order ASC";
    const [rows] = await db.query(sql);
    return rows;
  }

  static async getById(id) {
    const sql = "SELECT * FROM banners WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  }

  static async createBanner(data) {
    const { title, description, link, display_order, image } = data;

    const [existingBanner] = await db.query(
      "SELECT id FROM banners WHERE LOWER(title) = LOWER(?) LIMIT 1",
      [title.trim()]
    );
    if (existingBanner.length > 0) {
      throw new Error("Tiêu đề banner này đã tồn tại!");
    }

    // Xử lý ảnh
    let finalPath = null;
    if (image) {
      const normalizedPath = image.replace(/\\/g, "/");
      let relativePath = normalizedPath;
      if (normalizedPath.includes("uploads/")) {
        relativePath = normalizedPath.substring(
          normalizedPath.indexOf("uploads/")
        );
      }
      finalPath = `http://localhost:3000/${relativePath}`;
    }

    const sql = `INSERT INTO banners (title, description, link_url, display_order, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      title.trim(),
      description || null,
      link || null,
      display_order || 0,
      finalPath,
      1,
    ]);
    return result;
  }

  //CẬP NHẬT
  static async updateBanner(id, data) {
    const { title, description, link, display_order, image } = data;

    const [existingBanner] = await db.query(
      "SELECT id FROM banners WHERE LOWER(title) = LOWER(?) AND id != ? LIMIT 1",
      [title.trim(), id]
    );

    if (existingBanner.length > 0) {
      throw new Error("Tiêu đề banner này đã trùng với một banner khác!");
    }

    const sql = `
      UPDATE banners 
      SET title = ?, 
          description = ?, 
          link_url = ?, 
          display_order = ? 
      WHERE id = ?
    `;

    await db.query(sql, [
      title.trim(),
      description || null,
      link || null,
      display_order || 0,
      id,
    ]);

    // 4. CẬP NHẬT ẢNH
    if (image) {
      const normalizedPath = image.replace(/\\/g, "/");

      let relativePath = normalizedPath;
      if (normalizedPath.includes("uploads/")) {
        relativePath = normalizedPath.substring(
          normalizedPath.indexOf("uploads/")
        );
      }

      const finalPath = `http://localhost:3000/${relativePath}`;

      await db.query("UPDATE banners SET image_url = ? WHERE id = ?", [
        finalPath,
        id,
      ]);
    }

    return true;
  }

  static async delete(id) {
    const sql = "UPDATE banners SET is_active = 0 WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result;
  }

  static async restore(id) {
    const sql = "UPDATE banners SET is_active = 1 WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result;
  }
}

module.exports = BannerModel;
