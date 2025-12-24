const Review = require("../models/Review");

exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.getReviewByBookId(req.params.id);
    return res.status(200).json(reviews);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi lấy đánh giá", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { user, book, rating, comment } = req.body;

    if (!user || !book || !rating) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ user, book và rating" });
    }

    const newId = await Review.create({ user, book, rating, comment });
    return res
      .status(201)
      .json({ message: "Đánh giá thành công", reviewId: newId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi gửi đánh giá", error: error.message });
  }
};
