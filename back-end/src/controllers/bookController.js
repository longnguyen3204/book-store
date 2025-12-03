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

// Cập nhật thông tin sách
exports.updateBook = async(req, res) => {
    try {
        const bookId = req.params.id; // Lấy ID từ đường dẫn (số 1, 2...)
        const updateData = req.body;  // Lấy dữ liệu mới từ Postman gửi lên

        // Kiểm tra xem sách có tồn tại không
        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Không tìm thấy cuốn sách này!" });
        }

        // Cập nhật thông tin sách 
        const dataToUpdate = {
            ...existingBook, // Copy toàn bộ dữ liệu cũ
            ...updateData    // Đè dữ liệu mới lên
        };
        
        await Book.updateBookInfo(bookId, dataToUpdate);
        
        res.json({ message: "Cập nhật thông tin sách thành công!" });
    } catch(error) {
        console.error("Lỗi cập nhật thông tin sách", error);
        res.status(500).json({ message: "Lỗi server" });
    }
}

// Xem thông tin chi tiết của 1 quyển sách
exports.getBookDetail = async (req, res) => {
    try {
        const bookId = req.params.id;

        // Kiểm tra xem sách có tồn tại không
        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Không tìm thấy cuốn sách này!" });
        }

        res.status(200).json(existingBook);
    } catch (error) {
        console.error("Lỗi xem chi tiết sách:", error);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// Xóa sách
exports.delBook = async(req, res) => {
    try {
        const bookId = req.params.id;

        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Không tìm thấy cuốn sách này!" });
        }

        await Book.delBook(bookId);

        res.json({ message: "Xóa sách thành công!" });
    } catch(error) {
        console.error("Lỗi xóa sách", error);
        res.status(500).json({ message: "Lỗi server" });
    }
}