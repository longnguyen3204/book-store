const Order = require('../models/Order');

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
