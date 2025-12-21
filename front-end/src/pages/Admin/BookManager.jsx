// src/pages/Admin/BookManager.jsx
import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

const BookManager = () => {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({ title: '', price: '', category: '', image: null });
    const [categories, setCategories] = useState([]);
    const [editingBook, setEditingBook] = useState(null); // ID sách đang sửa

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [bookRes, catRes] = await Promise.all([adminApi.getAllBooks(), adminApi.getAllCategories()]);
        setBooks(bookRes.data);
        setCategories(catRes.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('price', formData.price);
        data.append('category', formData.category);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingBook) {
                await adminApi.updateBook(editingBook, data);
            } else {
                await adminApi.createBook(data);
            }
            alert("Thành công!");
            setFormData({ title: '', price: '', category: '', image: null });
            setEditingBook(null);
            loadData();
        } catch (err) {
            alert("Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa?")) {
            await adminApi.deleteBook(id);
            loadData();
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book._id);
        setFormData({ title: book.title, price: book.price, category: book.category, image: null });
    };

    return (
        <div>
            <h2>Quản lý Sách</h2>
            
            {/* Form Thêm/Sửa */}
            <form onSubmit={handleSubmit} className="mb-4 p-3 border bg-white">
                <div className="mb-2">
                    <input type="text" placeholder="Tên sách" className="form-control" 
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="row mb-2">
                    <div className="col">
                        <input type="number" placeholder="Giá" className="form-control" 
                            value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div className="col">
                        <select className="form-control" value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value})} required>
                            <option value="">Chọn danh mục</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mb-2">
                    <input type="file" className="form-control" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                </div>
                <button type="submit" className="btn btn-primary">{editingBook ? 'Cập nhật' : 'Thêm mới'}</button>
                {editingBook && <button type="button" className="btn btn-secondary ms-2" onClick={() => {setEditingBook(null); setFormData({ title: '', price: '', category: '', image: null })}}>Hủy</button>}
            </form>

            {/* Danh sách */}
            <table className="table table-bordered bg-white">
                <thead><tr><th>Tên</th><th>Giá</th><th>Danh mục</th><th>Hành động</th></tr></thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.price}</td>
                            <td>{book.category?.name || book.category}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(book)}>Sửa</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookManager;