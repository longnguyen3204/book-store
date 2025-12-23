const Voucher = require("../models/Voucher");

exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.getAll();
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách voucher" });
  }
};

exports.addVoucher = async (req, res) => {
  try {
    const result = await Voucher.create(req.body);
    res.status(201).json({ message: "Thêm thành công", id: result.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi thêm voucher (Mã code có thể bị trùng)" });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    await Voucher.delete(req.params.id);
    res.json({ message: "Xóa/Ẩn voucher thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa voucher" });
  }
};

exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Đảm bảo mã code luôn viết hoa nếu có thay đổi
    if (data.code) data.code = data.code.toUpperCase();

    await Voucher.update(id, data);
    res.json({ message: "Cập nhật voucher thành công" });
  } catch (error) {
    console.error("Lỗi updateVoucher:", error);
    res.status(500).json({ message: "Lỗi cập nhật voucher" });
  }
};

exports.restoreVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await Voucher.update(id, { is_active: 1 });
    res.json({ message: "Đã hiện lại voucher" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thao tác" });
  }
};
