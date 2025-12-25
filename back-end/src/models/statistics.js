const db = require("../config/db");

class statistics {
  // 1. Lấy Banner
  static async getActiveBanners() {
    const sql = `
        SELECT 
            title, 
            image_url AS image, 
            link_url AS link
        FROM banners 
        WHERE is_active = 1 
        ORDER BY display_order ASC`;
    const [rows] = await db.query(sql);
    return rows;
  }

  // 2. Lấy sách nổi bật (Featured)
  static async getFeatured() {
    const sql = `
        SELECT 
            b.id, 
            b.name AS title, 
            b.price, 
            b.original_price,
            (
                SELECT a.name 
                FROM book_authors ba 
                JOIN authors a ON a.id = ba.author_id 
                WHERE ba.book_id = b.id 
                LIMIT 1
            ) AS author,
            (
                SELECT image_url 
                FROM book_images 
                WHERE book_id = b.id 
                ORDER BY is_thumbnail DESC, id ASC 
                LIMIT 1
            ) AS image
        FROM books b 
        WHERE b.is_active = 1 
        ORDER BY b.created_at DESC 
        LIMIT 4`;

    const [rows] = await db.query(sql);
    return rows;
  }

  // 3. Lấy sách theo Tab danh mục (Popular)
  static async getPopularTabs() {
    const sql = `
        SELECT 
            b.id, 
            b.name AS title, 
            b.price, 
            b.original_price,
            c.name AS category_name,
            (
                SELECT a.name 
                FROM book_authors ba 
                JOIN authors a ON a.id = ba.author_id 
                WHERE ba.book_id = b.id 
                LIMIT 1
            ) AS author,
            (
                SELECT image_url 
                FROM book_images 
                WHERE book_id = b.id 
                ORDER BY is_thumbnail DESC, id ASC 
                LIMIT 1
            ) AS image
        FROM books b
        JOIN book_categories bc ON b.id = bc.book_id
        JOIN categories c ON bc.category_id = c.id
        WHERE b.is_active = 1
        ORDER BY b.view_count DESC`;
    const [rows] = await db.query(sql);

    return rows.reduce((acc, book) => {
      const key = book.category_name;
      if (!acc[key]) acc[key] = [];
      if (acc[key].length < 8) acc[key].push(book);
      return acc;
    }, {});
  }

  // 4. Lấy sách bán chạy (Best Selling)
  static async getBestSelling() {
    const sql = `
        SELECT 
            b.id, 
            b.name AS title, 
            b.description,
            b.price, 
            b.original_price,
            b.sold_count,
            (
                SELECT a.name 
                FROM book_authors ba 
                JOIN authors a ON a.id = ba.author_id 
                WHERE ba.book_id = b.id 
                LIMIT 1
            ) AS author,
            (
                SELECT image_url 
                FROM book_images 
                WHERE book_id = b.id 
                ORDER BY is_thumbnail DESC, id ASC 
                LIMIT 1
            ) AS image
        FROM books b 
        WHERE b.is_active = 1 
        ORDER BY b.sold_count DESC 
        LIMIT 1`;
    const [rows] = await db.query(sql);
    return rows[0];
  }

  // 5. Lấy sách giảm giá (Special Offers)
  static async getSpecialOffers() {
    const sql = `
        SELECT 
            b.id, 
            b.name AS title, 
            b.price, 
            b.original_price,
            (
                SELECT a.name 
                FROM book_authors ba 
                JOIN authors a ON a.id = ba.author_id 
                WHERE ba.book_id = b.id 
                LIMIT 1
            ) AS author,
            (
                SELECT image_url 
                FROM book_images 
                WHERE book_id = b.id 
                ORDER BY is_thumbnail DESC, id ASC 
                LIMIT 1
            ) AS image
        FROM books b 
        WHERE b.is_active = 1 AND b.price < b.original_price
        ORDER BY (b.original_price - b.price) DESC 
        LIMIT 10`;
    const [rows] = await db.query(sql);
    return rows;
  }
}

module.exports = statistics;
