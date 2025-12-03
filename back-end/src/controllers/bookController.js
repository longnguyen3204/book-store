const Book = require('../models/Book');

//Hiển thị danh sách các sách hiện có
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.getAll();
        
        res.status(200).json(books);
    } catch (error) {
        console.error("Lỗi lấy danh sách sách:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
}

// Thêm sách mới
exports.addBook = async(req, res) => {
    try {
        const { 
            publisher_id, name, isbn, description, 
            original_price, price, publish_year, 
            language, weight, size, page_count 
        } = req.body;

        if (!name || !original_price || !price) {
            return res.status(400).json({ message: "Vui lòng nhập tên sách, giá gốc và giá bán!" });
        }

        const result = await Book.create({
            publisher_id, name, isbn, description, 
            original_price, price, publish_year, 
            language, weight, size, page_count
        });

        res.status(201).json({ 
            message: "Thêm sách thành công!", 
            bookId: result.insertId // Trả về ID của cuốn sách vừa tạo
        });
        
    } catch (error) {
        console.error("Lỗi thêm sách:", error);
        res.status(500).json({ message: "Lỗi Server khi thêm sách" });
    }
}