const db = require('../config/db');

class Book {
    // Hàm tìm book bằng id
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
        return rows[0]; // Trả về book tìm thấy, hoặc undefined nếu không có
    }

    // Hàm lấy tất cả các sách
    static async getAll() {
        const [rows] = await db.query('SELECT id, name, original_price, price, quantity FROM books');
        return rows;
    }

    // Tìm sách theo tác giả, nhà xuất bản, năm xuất bản, thể loại
    static async search(filters) {
        const { author, publisher, publish_year, category, category_id, sort } = filters;

        const joins = [];
        const conditions = [];
        const params = [];

        if (author) {
            joins.push('JOIN book_authors ba ON b.id = ba.book_id');
            joins.push('JOIN authors a ON a.id = ba.author_id');
            conditions.push('a.name LIKE ?');
            params.push(`%${author}%`);
        }

        if (publisher) {
            joins.push('JOIN publishers p ON b.publisher_id = p.id');
            conditions.push('p.name LIKE ?');
            params.push(`%${publisher}%`);
        }

        if (publish_year) {
            conditions.push('b.publish_year = ?');
            params.push(publish_year);
        }

        if (category || category_id) {
            joins.push('JOIN book_categories bc ON b.id = bc.book_id');
            joins.push('JOIN categories c ON c.id = bc.category_id');
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
            SELECT DISTINCT 
                b.id, b.name, b.original_price, b.price, b.quantity, b.publish_year
            FROM books b
            ${joinsSql}
            ${whereSql}
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