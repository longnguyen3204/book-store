const db = require("../config/db");

class Order {
  // 1. Lấy toàn bộ danh sách đơn hàng cho Admin
  static async getAllOrders() {
    const sql = `
            SELECT 
                o.id,
                o.user_id,
                u.fullname AS customer_name,  
                u.phone_number AS phone,       
                o.shipping_address AS address, 
                o.total_amount AS totalPrice,  
                o.status,
                o.order_date AS createdAt,     
                GROUP_CONCAT(
                    CONCAT(b.name, ' (x', od.quantity, ')') 
                    SEPARATOR ', '
                ) AS items
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_details od ON o.id = od.order_id
            LEFT JOIN books b ON od.book_id = b.id
            GROUP BY o.id
            ORDER BY o.order_date DESC
        `;
    const [rows] = await db.query(sql);
    return rows;
  }

  // 2. Lấy lịch sử đơn hàng của user (có lọc status)
  static async getHistoryByUser(userId, status) {
    const params = [userId];
    let statusFilter = "";

    if (status && status !== "all") {
      statusFilter = " AND o.status = ?";
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
                b.name AS book_name,
                b.id AS book_id_ref
            FROM orders o
            JOIN order_details od ON od.order_id = o.id
            JOIN books b ON b.id = od.book_id
            WHERE o.user_id = ? ${statusFilter}
            ORDER BY o.order_date DESC, o.id DESC
        `;

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 3. Cập nhật trạng thái đơn hàng (Fix: 2 tham số)
  static async updateStatus(orderId, status) {
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    const [result] = await db.query(sql, [status, orderId]);
    return result;
  }
}

module.exports = Order;
