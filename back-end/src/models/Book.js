const db = require('../config/db');

class Book {
    // Hàm tìm book bằng id
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
        return rows[0]; // Trả về book tìm thấy, hoặc undefined nếu không có
    }

    // Hàm lấy tất cả các sách
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM books');
        return rows;
    }

    // Hàm tạo book mới
    static async create(bookInfo) {
        const { publisher_id, name, isbn, description, original_price, price, language, weight, size, publish_year, page_count } = bookInfo;
        const sql = `INSERT INTO books (publisher_id, name, isbn, description, original_price, price, language, weight, size, publish_year, page_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // Thực thi lệnh insert
        const [result] = await db.query(sql, [
            publisher_id, 
            name, 
            isbn,
            description, 
            original_price, 
            price,
            language,
            weight,
            size,
            publish_year,
            page_count
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

    
}
module.exports = Book;