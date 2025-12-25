const BannerModel = require("../models/Banner");

exports.getHeroSlides = async (req, res) => {
  try {
    const allBanners = await BannerModel.getAll();

    res.status(200).json(allBanners);
  } catch (error) {
    console.error("Lỗi getHeroSlides:", error);
    res.status(500).json({ message: "Lỗi server khi tải slide" });
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await BannerModel.getById(id);

    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }

    const responseData = {
      ...banner,
      link: banner.link_url,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Lỗi getDetail:", error);
    res.status(500).json({ message: "Lỗi lấy chi tiết banner" });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const b = req.body;
    const bannerData = {
      title: b.title,
      description: b.description,
      link: b.link,
      display_order: parseInt(b.display_order, 10) || 0,
    };
    if (req.file) bannerData.image = req.file.path;

    await BannerModel.createBanner(bannerData);
    res.status(201).json({ message: "Thêm thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;

    const existingBanner = await BannerModel.getById(bannerId);
    if (!existingBanner) {
      return res.status(404).json({ message: "Không tìm thấy banner!" });
    }

    const b = req.body;

    const dataToUpdate = {
      title: b.title || existingBanner.title,
      description:
        b.description !== undefined
          ? b.description
          : existingBanner.description,

      link: b.link !== undefined ? b.link : existingBanner.link_url,

      display_order:
        b.display_order !== undefined
          ? parseInt(b.display_order, 10)
          : existingBanner.display_order,
    };

    if (req.file) {
      dataToUpdate.image = req.file.path;
    }

    // 4. Gọi Model
    await BannerModel.updateBanner(bannerId, dataToUpdate);

    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi updateBanner:", error);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await BannerModel.delete(id);
    res.status(200).json({ message: "Đã ẩn banner thành công" });
  } catch (error) {
    console.error("Lỗi deleteBanner:", error);
    res.status(500).json({ message: "Lỗi khi ẩn banner" });
  }
};

exports.restoreBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await BannerModel.restore(id);
    res.status(200).json({ message: "Đã khôi phục banner thành công" });
  } catch (error) {
    console.error("Lỗi restoreBanner:", error);
    res.status(500).json({ message: "Lỗi khi khôi phục banner" });
  }
};
