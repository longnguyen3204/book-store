const Order = require('../models/Order');
const db = require('../config/db');
const Cart = require('../models/Cart');

// Lịch sử đơn hàng (đã mua / hủy / giao ...)
exports.getHistory = async (req, res) => {
    try {
        const { status, ...rest } = req.query || {};

        const allowedKeys = ['status'];
        const extraKeys = Object.keys(rest || {});
        if (extraKeys.length) {
            return res.status(400).json({ message: `Tham số không hỗ trợ: ${extraKeys.join(', ')}` });
        }

        const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `status phải thuộc: ${allowedStatuses.join(', ')}` });
        }

        const rows = await Order.getHistoryByUser(req.user.id, status);

        const ordersMap = new Map();
        rows.forEach((row) => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    order_id: row.order_id,
                    order_date: row.order_date,
                    total_amount: Number(row.total_amount),
                    status: row.status,
                    payment_method_id: row.payment_method_id,
                    voucher_id: row.voucher_id,
                    shipping_address: row.shipping_address,
                    note: row.note,
                    items: []
                });
            }
            const order = ordersMap.get(row.order_id);
            order.items.push({
                book_id: row.book_id,
                book_name: row.book_name,
                quantity: row.quantity,
                price: Number(row.price),
                line_total: Number((Number(row.price) * row.quantity).toFixed(2))
            });
        });

        const orders = Array.from(ordersMap.values());
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Hủy đơn hàng của user
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        if (!orderId) return res.status(400).json({ message: 'orderId không hợp lệ' });

        const rows = await Order.getHistoryByUser(req.user.id, null);
        const target = rows.find((o) => o.order_id === orderId);
        if (!target) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const currentStatus = (target.status || '').toLowerCase();
        const cancellable = ['pending', 'processing', 'shipped', 'shipping', 'spending'];
        if (!cancellable.includes(currentStatus)) {
            return res.status(400).json({ message: 'Đơn hàng không thể hủy' });
        }

        await Order.updateStatus(req.user.id, orderId, 'cancelled');
        return res.json({ message: 'Đã hủy đơn hàng', order_id: orderId });
    } catch (error) {
        console.error('Lỗi hủy đơn:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

// Đặt hàng từ danh sách sách (từ giỏ hoặc truyền trực tiếp)
exports.placeOrder = async (req, res) => {
    const { items, shipping_address, note, payment_method_id, voucher_id } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'items phải là mảng và không được trống' });
    }

    // Chuẩn hóa và validate input
    const normalizedItems = items.map((it) => ({
        book_id: Number(it.book_id),
        quantity: Number(it.quantity ?? 1),
    }));

    if (normalizedItems.some((it) => Number.isNaN(it.book_id) || Number.isNaN(it.quantity) || it.quantity <= 0)) {
        return res.status(400).json({ message: 'book_id phải là số và quantity > 0' });
    }

    const bookIds = normalizedItems.map((it) => it.book_id);
    const uniqueBookIds = [...new Set(bookIds)];

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Khóa tồn kho các sách liên quan
        const [bookRows] = await connection.query(
            `SELECT id, name, price, quantity FROM books WHERE id IN (?) FOR UPDATE`,
            [uniqueBookIds]
        );

        if (bookRows.length !== uniqueBookIds.length) {
            await connection.rollback();
            return res.status(404).json({ message: 'Có sách không tồn tại' });
        }

        const bookMap = new Map(bookRows.map((b) => [b.id, b]));

        // Kiểm tra tồn kho và tính tổng
        for (const it of normalizedItems) {
            const book = bookMap.get(it.book_id);
            if (!book) {
                await connection.rollback();
                return res.status(404).json({ message: `Sách ${it.book_id} không tồn tại` });
            }
            if (book.quantity !== null && book.quantity !== undefined && it.quantity > book.quantity) {
                await connection.rollback();
                return res.status(400).json({ message: `Vượt quá tồn kho cho sách ${book.name}` });
            }
        }

        const totalAmount = normalizedItems.reduce((sum, it) => {
            const book = bookMap.get(it.book_id);
            return sum + Number(book.price || 0) * it.quantity;
        }, 0);

        // Tạo order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_amount, status, payment_method_id, voucher_id, shipping_address, note)
             VALUES (?, ?, 'pending', ?, ?, ?, ?)`,
            [
                req.user.id,
                totalAmount,
                payment_method_id ?? null,
                voucher_id ?? null,
                shipping_address ?? null,
                note ?? null,
            ]
        );
        const orderId = orderResult.insertId;

        // Chèn chi tiết đơn hàng
        const orderDetails = normalizedItems.map((it) => {
            const book = bookMap.get(it.book_id);
            return [orderId, it.book_id, it.quantity, Number(book.price)];
        });

        await connection.query(
            `INSERT INTO order_details (order_id, book_id, quantity, price) VALUES ?`,
            [orderDetails]
        );

        // Trừ tồn kho (nếu có quản lý tồn)
        for (const it of normalizedItems) {
            const book = bookMap.get(it.book_id);
            if (book.quantity !== null && book.quantity !== undefined) {
                await connection.query(
                    `UPDATE books SET quantity = quantity - ? WHERE id = ?`,
                    [it.quantity, it.book_id]
                );
            }
        }

        // Xóa các item đã đặt khỏi giỏ hàng của user
        const cart = await Cart.findByUserId(req.user.id);
        if (cart) {
            await connection.query(
                `DELETE FROM cart_items WHERE cart_id = ? AND book_id IN (?)`,
                [cart.id, uniqueBookIds]
            );
        }

        await connection.commit();

        return res.status(201).json({
            message: 'Đặt hàng thành công',
            order_id: orderId,
            total_amount: Number(totalAmount),
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Lỗi đặt hàng:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    } finally {
        if (connection) connection.release();
    }
};
