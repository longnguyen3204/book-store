const Cart = require("../models/Cart");
const Book = require("../models/Book");

const ensureCart = async (userId) => {
  return Cart.findOrCreateByUser(userId);
};

exports.getCart = async (req, res) => {
  try {
    const cart = await ensureCart(req.user.id);
    const items = await Cart.getItems(cart.id);
    res.json({ cart_id: cart.id, items });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { book_id, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10);
    if (!book_id || Number.isNaN(qty) || qty <= 0) {
      return res
        .status(400)
        .json({ message: "book_id và quantity > 0 là bắt buộc" });
    }

    const book = await Book.findById(book_id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });

    const cart = await ensureCart(req.user.id);
    const existing = await Cart.getItem(cart.id, book_id);
    const newQty = (existing?.quantity || 0) + qty;

    if (book.quantity !== null && newQty > book.quantity) {
      return res.status(400).json({ message: "Vượt quá tồn kho" });
    }

    await Cart.addItem(cart.id, book_id, qty);
    const items = await Cart.getItems(cart.id);
    res.json({ message: "Đã thêm vào giỏ", items });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty)) {
      return res.status(400).json({ message: "quantity phải là số" });
    }

    const cart = await ensureCart(req.user.id);
    const existing = await Cart.getItem(cart.id, bookId);
    if (!existing) {
      return res.status(404).json({ message: "Sách không có trong giỏ" });
    }

    if (qty <= 0) {
      await Cart.removeItem(cart.id, bookId);
      const items = await Cart.getItems(cart.id);
      return res.json({ message: "Đã xóa khỏi giỏ", items });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    if (book.quantity !== null && qty > book.quantity) {
      return res.status(400).json({ message: "Vượt quá tồn kho" });
    }

    await Cart.updateItemQuantity(cart.id, bookId, qty);
    const items = await Cart.getItems(cart.id);
    res.json({ message: "Đã cập nhật số lượng", items });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { bookId } = req.params;
    const cart = await ensureCart(req.user.id);
    await Cart.removeItem(cart.id, bookId);
    const items = await Cart.getItems(cart.id);
    res.json({ message: "Đã xóa khỏi giỏ", items });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tính tổng tiền giỏ hàng (tất cả hoặc danh sách book_id được chọn)
exports.calculateTotal = async (req, res) => {
  try {
    const { bookIds } = req.body || {};

    let selectedIds;
    if (bookIds !== undefined) {
      if (!Array.isArray(bookIds) || bookIds.length === 0) {
        return res
          .status(400)
          .json({ message: "bookIds phải là mảng và không được trống" });
      }
      selectedIds = bookIds.map((id) => Number(id));
      if (selectedIds.some((id) => Number.isNaN(id))) {
        return res.status(400).json({ message: "bookIds phải chứa số hợp lệ" });
      }
    }

    const cart = await ensureCart(req.user.id);
    const items = await Cart.getItemsForTotal(cart.id, selectedIds);

    if (!items.length) {
      return res
        .status(400)
        .json({ message: "Giỏ hàng trống hoặc không có sách được chọn" });
    }

    const invalidStock = items.find(
      (item) =>
        item.stock !== null &&
        item.stock !== undefined &&
        item.quantity > item.stock
    );
    if (invalidStock) {
      return res
        .status(400)
        .json({
          message: `Vượt quá tồn kho cho book_id ${invalidStock.book_id}`,
        });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.quantity,
      0
    );
    const original_total = items.reduce(
      (sum, item) => sum + Number(item.original_price || 0) * item.quantity,
      0
    );

    const detail = items.map((item) => ({
      book_id: item.book_id,
      quantity: item.quantity,
      price: Number(item.price),
      original_price: Number(item.original_price),
      line_total: Number((Number(item.price) * item.quantity).toFixed(2)),
    }));

    res.json({
      cart_id: cart.id,
      items: detail,
      subtotal: Number(subtotal.toFixed(2)),
      original_total: Number(original_total.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
