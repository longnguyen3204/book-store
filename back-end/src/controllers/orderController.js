const db = require("../config/db"); // Đã thêm import db
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// 1. Lấy lịch sử đơn hàng (User)
exports.getHistory = async (req, res) => {
  try {
    const { status } = req.query || {};
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
          // QUAN TRỌNG: Thêm dòng này để truyền ảnh từ DB ra Frontend
          book_image: row.book_image,
          quantity: row.quantity,
          price: Number(row.price),
        });
      }
    });

    res.json(Array.from(ordersMap.values()));
  } catch (error) {
    console.error(error);
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
  const {
    items,
    shipping_address,
    total_amount,
    payment_method_id,
    voucher_id,
    note,
  } = req.body;
  const userId = req.user.id;

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Bước 1: Tạo đơn hàng chính
    const orderId = await Order.create(connection, {
      user_id: userId,
      total_amount,
      shipping_address,
      payment_method_id: payment_method_id || 1,
      voucher_id: voucher_id || null,
      note: note || "",
    });

    // Bước 2: Tạo chi tiết đơn hàng & Cập nhật kho
    for (const item of items) {
      await Order.createDetail(connection, orderId, item);

      // Bước 3: Cập nhật số lượng tồn kho (Sửa stock -> quantity theo DB)
      const updateQtySql =
        "UPDATE books SET quantity = quantity - ? WHERE id = ?";
      await connection.query(updateQtySql, [item.quantity, item.book_id]);

      // Cập nhật sold_count (Số lượng đã bán)
      const updateSoldSql =
        "UPDATE books SET sold_count = sold_count + ? WHERE id = ?";
      await connection.query(updateSoldSql, [item.quantity, item.book_id]);
    }

    // Bước 4: Xóa các mục trong giỏ hàng (cart_items) sau khi đặt thành công
    // Tìm giỏ hàng của user và xóa các book_id tương ứng
    const deleteCartItemsSql = `
        DELETE FROM cart_items 
        WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?) 
        AND book_id IN (?)
    `;
    const bookIds = items.map((i) => i.book_id);
    await connection.query(deleteCartItemsSql, [userId, bookIds]);

    await connection.commit();
    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      order_id: orderId,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Lỗi đặt hàng:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống: " + error.message });
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
