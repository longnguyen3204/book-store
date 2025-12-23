const db = require("../config/db"); // Đã thêm import db
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// 1. Lấy lịch sử đơn hàng (User)
exports.getHistory = async (req, res) => {
  try {
    const { status } = req.query || {};
    const allowedStatuses = [
      "pending",
      "processing",
      "shipping",
      "completed",
      "cancelled",
    ];

    if (status && !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
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
          shipping_address: row.shipping_address,
          items: [],
        });
      }
      const order = ordersMap.get(row.order_id);
      if (row.book_id) {
        order.items.push({
          book_id: row.book_id,
          book_name: row.book_name,
          quantity: row.quantity,
          price: Number(row.price),
        });
      }
    });

    res.json(Array.from(ordersMap.values()));
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Cập nhật trạng thái (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.updateStatus(id, status.toLowerCase()); // Fix: chỉ 2 tham số
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật" });
  }
};

// 3. Hủy đơn hàng (User)
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const rows = await Order.getHistoryByUser(req.user.id, null);
    const target = rows.find((o) => o.order_id === orderId);

    if (!target) return res.status(404).json({ message: "Không thấy đơn" });

    const cancellable = ["pending", "processing"];
    if (!cancellable.includes(target.status.toLowerCase())) {
      return res.status(400).json({ message: "Không thể hủy đơn này" });
    }

    await Order.updateStatus(orderId, "cancelled"); // Fix: bỏ req.user.id thừa
    res.json({ message: "Đã hủy đơn hàng", order_id: orderId });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 4. Đặt hàng
exports.placeOrder = async (req, res) => {
  const { items, shipping_address } = req.body;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.commit();
    res.status(201).json({ message: "Đặt hàng thành công" });
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ message: "Lỗi đặt hàng" });
  } finally {
    if (connection) connection.release();
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders(); // Gọi từ Model Order
    res.json(orders);
  } catch (error) {
    console.error("Lỗi getAllOrders:", error);
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
  }
};
