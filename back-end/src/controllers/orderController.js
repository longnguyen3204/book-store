const Order = require("../models/Order");

// 1. Lịch sử đơn hàng (User xem)
exports.getHistory = async (req, res) => {
  try {
    const { status, ...rest } = req.query || {};

    // Check tham số thừa
    const extraKeys = Object.keys(rest || {});
    if (extraKeys.length) {
      return res
        .status(400)
        .json({ message: `Tham số không hỗ trợ: ${extraKeys.join(", ")}` });
    }

    // [FIX] Danh sách trạng thái chuẩn hóa
    const allowedStatuses = [
      "pending",
      "processing",
      "shipping", // Đồng bộ: đang giao
      "completed", // Đồng bộ: hoàn thành
      "cancelled",
    ];

    if (status && !allowedStatuses.includes(status.toLowerCase())) {
      return res
        .status(400)
        .json({ message: `Status phải thuộc: ${allowedStatuses.join(", ")}` });
    }

    const rows = await Order.getHistoryByUser(req.user.id, status);

    // Gom nhóm dữ liệu
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
          items: [],
        });
      }
      const order = ordersMap.get(row.order_id);

      if (row.book_id) {
        order.items.push({
          book_id: row.book_id,
          book_name: row.book_name, // [FIX] Lấy từ alias đã sửa trong Model
          quantity: row.quantity,
          price: Number(row.price),
          line_total: Number((Number(row.price) * row.quantity).toFixed(2)),
        });
      }
    });

    const orders = Array.from(ordersMap.values());
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Lấy tất cả đơn hàng (Admin xem)
exports.getAllOrders = async (req, res) => {
  try {
    const rows = await Order.getAllOrders();
    res.json(rows);
  } catch (error) {
    console.error("Lỗi lấy đơn hàng Admin:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

// 3. Cập nhật trạng thái
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Thiếu thông tin status" });
    }

    // [FIX] Danh sách cho phép (giống hệt getHistory)
    const allowedStatuses = [
      "pending",
      "processing",
      "shipping",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: `Trạng thái không hợp lệ. Phải là: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    await Order.updateStatus(id, status.toLowerCase());

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Lỗi update status:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });
  }
};
