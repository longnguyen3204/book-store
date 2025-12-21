const db = require('../config/db');

class Book {
    // Lấy ảnh: ưu tiên ảnh trong DB, nếu không có thì dùng ảnh tĩnh trong public/images theo id (harrypotter.jpg cho id=2)
    static thumbnailSql = `
        SELECT image_url 
        FROM book_images 
        WHERE book_id = b.id 
        ORDER BY is_thumbnail DESC, id ASC 
        LIMIT 1
    `;

    static async findById(id) {
        const sql = `
            SELECT 
                b.id,
                b.name,
                b.description,
                b.original_price,
                b.price,
                b.quantity,
                b.publish_year,
                (SELECT a.name 
                 FROM book_authors ba 
                 JOIN authors a ON a.id = ba.author_id 
                 WHERE ba.book_id = b.id 
                 LIMIT 1) AS author,
                (${Book.thumbnailSql}) AS image
            FROM books b
            WHERE b.id = ?`;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }

    static async getAll() {
        const sql = `
            SELECT 
                b.id,
                b.name,
                b.description,
                b.original_price,
                b.price,
                b.quantity,
                b.publish_year,
                (SELECT a.name 
                 FROM book_authors ba 
                 JOIN authors a ON a.id = ba.author_id 
                 WHERE ba.book_id = b.id 
                 LIMIT 1) AS author,
                (${Book.thumbnailSql}) AS image
            FROM books b`;
        const [rows] = await db.query(sql);
        return rows;
    }

    // Tìm sách theo tác giả, nhà xuất bản, năm xuất bản, thể loại
    static async search(filters) {
        const { author, publisher, publish_year, category, category_id, sort } = filters;

        const joins = [];
        const conditions = [];
        const params = [];

        joins.push('LEFT JOIN book_authors ba ON b.id = ba.book_id');
        joins.push('LEFT JOIN authors a ON a.id = ba.author_id');
        joins.push('LEFT JOIN book_images i ON b.id = i.book_id');

        if (author) {
            conditions.push('a.name LIKE ?');
            params.push(`%${author}%`);
        }

        if (publisher) {
            joins.push('LEFT JOIN publishers p ON b.publisher_id = p.id');
            conditions.push('p.name LIKE ?');
            params.push(`%${publisher}%`);
        }

        if (publish_year) {
            conditions.push('b.publish_year = ?');
            params.push(publish_year);
        }

        if (category || category_id) {
            joins.push('LEFT JOIN book_categories bc ON b.id = bc.book_id');
            joins.push('LEFT JOIN categories c ON c.id = bc.category_id');
            if (category_id) {
                conditions.push('c.id = ?');
                params.push(category_id);
            } else {
                conditions.push('c.name LIKE ?');
                params.push(`%${category}%`);
            }
        }

        const joinsSql = joins.length ? ' ' + Array.from(new Set(joins)).join(' ') : '';
        const whereSql = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';

        let orderSql = '';
        if (sort === 'price_asc') orderSql = ' ORDER BY b.price ASC';
        else if (sort === 'price_desc') orderSql = ' ORDER BY b.price DESC';

        const sql = `
            SELECT 
                b.id,
                b.name,
                b.description,
                b.original_price,
                b.price,
                b.quantity,
                b.publish_year,
                COALESCE(a.name, '') AS author,
                (SELECT image_url 
                 FROM book_images 
                 WHERE book_id = b.id 
                 ORDER BY is_thumbnail DESC, id ASC 
                 LIMIT 1) AS image
            FROM books b
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
            publisher_id, name, isbn, description, original_price, 
            price, language, weight, size, publish_year, page_count 
        } = bookInfo;

        const sql = `INSERT INTO books (
            publisher_id, name, isbn, description, original_price, price, 
            language, weight, size, publish_year, page_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // Thực thi lệnh insert
        const [result] = await db.query(sql, [
            publisher_id, name, isbn, description, original_price, 
            price, language, weight, size, publish_year, page_count
        ]);
        
        return result;
    }

    // Cập nhật thông tin sách
    static async updateBookInfo(id, data) {
        const { publisher_id, name, isbn, description, original_price, price, quantity, sold_count, publish_year, page_count } = data;
        const sql = `UPDATE books SET publisher_id = ?, name = ?, isbn = ?, description = ?, original_price = ?, 
                    price = ?, quantity = ?, sold_count = ?, publish_year = ?, page_count = ? WHERE id = ?`;
        await db.query(sql, [publisher_id, name, isbn, description, original_price, price, quantity, sold_count, publish_year, page_count, id]);
    }
    
    // Hàm xóa sách
    static async delBook(id) {
        const [deleted] = await db.query('DELETE FROM books WHERE id = ?', [id]);
        return deleted;
    }

}
module.exports = Book;