const db = require('../config/db');

class Category {
    // Hàm tìm Category bằng id
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0]; // Trả về Category tìm thấy, hoặc undefined nếu không có
    }

    // Hàm lấy tất cả các thể loại
    static async getAll() {
        const [rows] = await db.query('SELECT id, name, description FROM categories');
        return rows;
    }

    // Hàm lấy các sách thuộc thể loại đó
    static async getByCategory (id) {
        const [rows] = await db.query(
            'SELECT b.* FROM books b JOIN book_categories bc ON b.id = bc.book_id WHERE bc.category_id = ?', [id]);
        return rows;
    }

    // Hàm tạo Category mới
    static async create(categoryInfo) {
        const { name, description } = categoryInfo;

        const sql = `INSERT INTO categories (name, description) VALUES (?, ?)`;
        
        // Thực thi lệnh insert
        const [result] = await db.query(sql, [name, description]);
        
        return result;
    }

    // Cập nhật thể loại
    static async updateCategoryInfo(id, data) {
        const { name, description } = data;
        const sql = `UPDATE categories SET name = ?, description = ? WHERE id = ?`;
        await db.query(sql, [name, description, id]);
    }
    
    // Hàm xóa thể loại
    static async delCategory(id) {
        const [deleted] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
        return deleted;
    }

}
module.exports = Category;