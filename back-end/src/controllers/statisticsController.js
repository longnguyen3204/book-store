const statistics = require("../models/statistics");

exports.getHeroSlides = async (req, res) => {
  try {
    const data = await statistics.getActiveBanners();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi SQL Banner", error: error.message });
  }
};

exports.getFeaturedBooks = async (req, res) => {
  try {
    const data = await statistics.getFeatured();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi SQL Featured", error: error.message });
  }
};

exports.getPopularTabs = async (req, res) => {
  try {
    const data = await statistics.getPopularTabs();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi SQL Popular", error: error.message });
  }
};

exports.getBestSelling = async (req, res) => {
  try {
    const data = await statistics.getBestSelling();
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi SQL BestSelling", error: error.message });
  }
};

exports.getSpecialOffers = async (req, res) => {
  try {
    const data = await statistics.getSpecialOffers();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi SQL Offers", error: error.message });
  }
};
