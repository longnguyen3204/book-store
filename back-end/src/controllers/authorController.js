const Author = require("../models/Author");

//1. Lấy danh sách tác giả
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.getAll();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách tác giả" });
  }
};

//2. Thêm tác giả mới
exports.addAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên tác giả không được để trống" });
    }
    const newAuthor = await Author.create({ name, bio });
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm tác giả" });
  }
};

//3. Xem chi tiết tác giả
exports.getAuthorDetail = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author)
      return res.status(404).json({ message: "Không tìm thấy tác giả" });
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
