const db = require('../config/db');

class Order {
    // Lấy lịch sử đơn hàng của user (có thể lọc theo status)
    static async getHistoryByUser(userId, status) {
        const params = [userId];
        let statusFilter = '';
        if (status) {
            statusFilter = ' AND o.status = ?';
            params.push(status);
        }

        const sql = `
            SELECT 
                o.id AS order_id,
                o.order_date,
                o.total_amount,
                o.status,
                o.payment_method_id,
                o.voucher_id,
                o.shipping_address,
                o.note,
                od.book_id,
                od.quantity,
                od.price,
                b.name AS book_name
            FROM orders o
            JOIN order_details od ON od.order_id = o.id
            JOIN books b ON b.id = od.book_id
            WHERE o.user_id = ? ${statusFilter}
            ORDER BY o.order_date DESC, o.id DESC
        `;

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async updateStatus(userId, orderId, status) {
        const sql = `
            UPDATE orders 
            SET status = ?
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.query(sql, [status, orderId, userId]);
        return result;
    }
}

module.exports = Order;
