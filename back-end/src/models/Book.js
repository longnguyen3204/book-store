const db = require("../config/db");

class Book {
  // Lấy ảnh: ưu tiên ảnh trong DB, nếu không có thì dùng ảnh tĩnh trong public/images theo id (harrypotter.jpg cho id=2)
  static thumbnailSql = `
        SELECT image_url 
        FROM book_images 
        WHERE book_id = b.id 
        ORDER BY is_thumbnail DESC, id ASC 
        LIMIT 1
    `;
  static async getAll() {
    const sql = `SELECT 
        b.id,
        b.name,
        b.description,
        b.original_price,
        b.price,
        b.sold_count,
        b.quantity,
        b.page_count,
        b.publish_year,
        b.is_active,
        a.name AS author,
        c.id AS category_id,
        c.name AS category_name,        
        (${Book.thumbnailSql}) AS image
    FROM books b
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_categories bc ON b.id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.id
    GROUP BY b.id 
    ORDER BY b.id DESC`; // Sắp xếp sách mới nhất lên đầu

    const [rows] = await db.query(sql);
    return rows;
  }

  static async findById(id) {
    const sql = `
            SELECT 
                b.id,
                b.name,
                b.description,
                b.original_price,
                b.price,
                b.sold_count,
                b.quantity,
                b.page_count,
                b.publish_year,
                (SELECT a.name 
                 FROM book_authors ba 
                 JOIN authors a ON a.id = ba.author_id 
                 WHERE ba.book_id = b.id 
                 LIMIT 1) AS author,
                (${Book.thumbnailSql}) AS image
            FROM books b WHERE  b.id = ?AND b.is_active = 1`;
    const [rows] = await db.query(sql, [id]);
    return rows;
  }

  static async getActivity() {
    const sql = `SELECT
    b.id,
    b.name,
    b.description,
    b.original_price,
    b.price,
    b.sold_count,
    b.quantity,
    b.page_count,
    b.publish_year,
    b.is_active,
    a.id AS author_id,
    a.name AS author,
    c.id AS category_id,
    c.name AS category_name,
    c.name AS category_name,
    (${Book.thumbnailSql}) AS image
    FROM books b
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_categories bc ON b.id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.id
   WHERE b.is_active = 1 AND b.quantity > 0
    GROUP BY b.id; `;
    const [rows] = await db.query(sql);
    return rows;
  }

  // Tìm sách theo tác giả, nhà xuất bản, năm xuất bản, thể loại
  static async search(filters) {
    const { author, publisher, publish_year, category, category_id, sort } =
      filters;

    const joins = [];
    const conditions = [];
    const params = [];

    joins.push("LEFT JOIN book_authors ba ON b.id = ba.book_id");
    joins.push("LEFT JOIN authors a ON a.id = ba.author_id");
    joins.push("LEFT JOIN book_images i ON b.id = i.book_id");

    if (author) {
      conditions.push("a.name LIKE ?");
      params.push(`%${author}%`);
    }

    if (publisher) {
      joins.push("LEFT JOIN publishers p ON b.publisher_id = p.id");
      conditions.push("p.name LIKE ?");
      params.push(`%${publisher}%`);
    }

    if (publish_year) {
      conditions.push("b.publish_year = ?");
      params.push(publish_year);
    }

    if (category || category_id) {
      joins.push("LEFT JOIN book_categories bc ON b.id = bc.book_id");
      joins.push("LEFT JOIN categories c ON c.id = bc.category_id");
      if (category_id) {
        conditions.push("c.id = ?");
        params.push(category_id);
      } else {
        conditions.push("c.name LIKE ?");
        params.push(`%${category}%`);
      }
    }

    const joinsSql = joins.length
      ? " " + Array.from(new Set(joins)).join(" ")
      : "";
    const whereSql = conditions.length
      ? " WHERE " + conditions.join(" AND ")
      : "";

    let orderSql = "";
    if (sort === "price_asc") orderSql = " ORDER BY b.price ASC";
    else if (sort === "price_desc") orderSql = " ORDER BY b.price DESC";
    const sql = `
            SELECT 
                b.id,
                b.name,
                b.description,
                b.original_price,
                b.price,
                b.sold_count,
                b.quantity,
                b.publish_year,
                b.page_count,
                COALESCE(a.name, '') AS author,
                (SELECT image_url 
                 FROM book_images 
                 WHERE book_id = b.id 
                 ORDER BY is_thumbnail DESC, id ASC 
                 LIMIT 1) AS image
            FROM books b where b.is_active = 1
            ${joinsSql}
            ${whereSql}
            GROUP BY b.id
            ${orderSql}  
        `;

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // Hàm tạo book mới
  static async create(bookInfo) {
    const {
      publisher_id,
      category_id,
      author_id,
      name,
      isbn,
      description,
      original_price,
      price,
      quantity,
      language,
      weight,
      size,
      publish_year,
      page_count,
      image,
    } = bookInfo;

    const sql = `INSERT INTO books (
      publisher_id, name, isbn, description, original_price, price, 
      quantity, language, weight, size, publish_year, page_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      publisher_id,
      name,
      isbn,
      description,
      original_price,
      price,
      quantity || 0,
      language,
      weight,
      size,
      publish_year,
      page_count,
    ]);

    const newBookId = result.insertId;

    if (category_id) {
      await db.query(
        "INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)",
        [newBookId, category_id]
      );
    }

    if (author_id) {
      await db.query(
        "INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)",
        [newBookId, author_id]
      );
    }

    // --- SỬA TẠI ĐÂY: CHUẨN HÓA ĐƯỜNG DẪN TRƯỚC KHI LƯU ---
    if (image) {
      const normalizedPath = image.replace(/\\/g, "/"); // Chuyển \ thành /

      // 3. Nối thêm địa chỉ localhost
      const finalPath = `http://localhost:3000/${normalizedPath.substring(
        normalizedPath.indexOf("uploads/")
      )}`;
      await db.query(
        "INSERT INTO book_images (book_id, image_url, is_thumbnail) VALUES (?, ?, 1)",
        [newBookId, finalPath]
      );
    }

    return result;
  }

  static async updateBookInfo(id, data) {
    const {
      publisher_id, // Nếu frontend không gửi, cái này sẽ là undefined
      category_id,
      author_id,
      name,
      isbn, // Nếu frontend không gửi, cái này sẽ là undefined
      description,
      original_price,
      price,
      quantity,
      sold_count,
      publish_year,
      page_count,
      image,
    } = data;

    // 1. SỬA LỖI CHECK TRÙNG TÊN: Loại trừ ID hiện tại (AND id != ?)
    const [existingBook] = await db.query(
      "SELECT id FROM books WHERE LOWER(name) = LOWER(?) AND id != ? LIMIT 1",
      [name.trim(), id]
    );

    if (existingBook.length > 0) {
      throw new Error(
        "Tên sách này đã trùng với một cuốn sách khác trong hệ thống!"
      );
    }

    // 2. Cập nhật bảng books
    const sql = `UPDATE books SET 
                  publisher_id = ?, 
                  name = ?, 
                  isbn = ?, 
                  description = ?, 
                  original_price = ?, 
                  price = ?, 
                  quantity = ?, 
                  publish_year = ?, 
                  page_count = ? 
                WHERE id = ?`;

    await db.query(sql, [
      publisher_id || null, // Nếu không có thì set null để tránh lỗi
      name.trim(),
      isbn || null, // Nếu không có thì set null
      description,
      original_price,
      price,
      quantity,
      publish_year,
      page_count,
      id,
    ]);

    // 3. Cập nhật Thể loại
    if (category_id) {
      await db.query("DELETE FROM book_categories WHERE book_id = ?", [id]);
      await db.query(
        "INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)",
        [id, category_id]
      );
    }

    // 4. Cập nhật Tác giả
    if (author_id) {
      await db.query("DELETE FROM book_authors WHERE book_id = ?", [id]);
      await db.query(
        "INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)",
        [id, author_id]
      );
    }

    // 5. Cập nhật Ảnh (Chỉ chạy khi có upload ảnh mới)
    if (image) {
      const normalizedPath = image.replace(/\\/g, "/"); // Chuyển \ thành /
      let relativePath = normalizedPath;
      if (normalizedPath.includes("uploads/")) {
        relativePath = normalizedPath.substring(
          normalizedPath.indexOf("uploads/")
        );
      }

      const finalPath = `http://localhost:3000/${relativePath}`;

      // Set ảnh cũ thành không phải thumbnail
      await db.query(
        "UPDATE book_images SET is_thumbnail = 0 WHERE book_id = ?",
        [id]
      );

      // Thêm ảnh mới làm thumbnail
      await db.query(
        "INSERT INTO book_images (book_id, image_url, is_thumbnail) VALUES (?, ?, 1)",
        [id, finalPath]
      );
    }
  }
  static async delBook(id) {
    const sql = `UPDATE books SET is_active = 0 WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  }
  static async restoreBook(id) {
    const sql = `UPDATE books SET is_active = 1 WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  }
}
module.exports = Book;
