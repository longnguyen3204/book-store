const db = require("../config/db");

class Order {
  // 1. Lấy toàn bộ danh sách cho Admin
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
            ORDER BY o.order_date ASC
        `;
    const [rows] = await db.query(sql);
    return rows;
  }

  // Tạo Đơn hàng mới
  static async create(connection, orderData) {
    const {
      user_id,
      total_amount,
      shipping_address,
      payment_method_id,
      voucher_id,
      note,
    } = orderData;
    const sql = `
      INSERT INTO orders (user_id, total_amount, shipping_address, payment_method_id, voucher_id, note, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;
    const [result] = await connection.query(sql, [
      user_id,
      total_amount,
      shipping_address,
      payment_method_id,
      voucher_id,
      note,
    ]);
    return result.insertId;
  }

  // Tạo Chi tiết đơn hàng
  static async createDetail(connection, orderId, item) {
    const sql = `
      INSERT INTO order_details (order_id, book_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `;
    await connection.query(sql, [
      orderId,
      item.book_id,
      item.quantity,
      item.price,
    ]);
  }

  // Lấy lịch sử (User)
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
            o.shipping_address,
            od.book_id,
            od.quantity,
            od.price,
            b.name AS book_name,
            -- Phải có câu lệnh con này để lấy image_url từ bảng book_images
            (SELECT image_url FROM book_images WHERE book_id = b.id AND is_thumbnail = 1 LIMIT 1) AS book_image
        FROM orders o
        JOIN order_details od ON od.order_id = o.id
        JOIN books b ON b.id = od.book_id
        WHERE o.user_id = ? ${statusFilter}
        ORDER BY o.order_date DESC
    `;
    const [rows] = await db.query(sql, params);
    return rows;
  }
  static async updateStatus(orderId, status) {
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    const [result] = await db.query(sql, [status, orderId]);
    return result;
  }
}

module.exports = Order;
