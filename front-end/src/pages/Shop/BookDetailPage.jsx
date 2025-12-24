import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Breadcrumb,
  Image,
  Spin,
  message,
  Rate,
  Form,
  Input,
  List,
  Avatar,
  Modal,
  Tag,
  Divider,
} from "antd";
import {
  HomeOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import { getBookDetail } from "../../api/bookApi";
import { getOrderHistory } from "../../api/orderApi";
import { getReviewsByBook, createReview } from "../../api/reviewApi";
import defaultImg from "../../assets/images/default.png";
import { useCart } from "../Cart/CartContext";
import "./review.css";

function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const location = useLocation(); // Không dùng thì bỏ đi cho gọn
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canReview, setCanReview] = useState(false);

  const formatCurrency = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    []
  );

  const ratingStats = useMemo(() => {
    if (!reviews?.length) return { average: 0, count: 0, stars: {} };
    const count = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const stars = reviews.reduce((acc, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, {});
    // Fix lỗi chia cho 0 nếu count = 0 (dù đã check length ở trên nhưng thêm cho chắc)
    return { average: count ? (sum / count).toFixed(1) : 0, count, stars };
  }, [reviews]);

  const formatTitle = (product) =>
    product?.name || product?.title || "Đang cập nhật";
  const formatAuthor = (product) => product?.author || "Nhiều tác giả";
  const formatDescription = (product) =>
    product?.description ||
    product?.descriptionProduct ||
    "Chưa có mô tả cho sách này.";
  const mainImage = product?.imagesProduct?.[0] || product?.image || defaultImg;
  const secondaryImage =
    product?.imagesProduct?.[1] || product?.image || defaultImg;
  const priceValue =
    product?.price ?? product?.original_price ?? product?.prevPrice ?? 0;
  const originalValue = product?.original_price || product?.prevPrice;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resProduct, resReviews] = await Promise.all([
          getBookDetail(id),
          getReviewsByBook(id),
        ]);

        let rawData = resProduct.metadata?.product || resProduct;
        const finalProduct = Array.isArray(rawData) ? rawData[0] : rawData;
        setProduct(finalProduct);

        const finalReviews = Array.isArray(resReviews) ? resReviews : [];
        setReviews(finalReviews);

        console.log("Product:", finalProduct);
        console.log("Reviews:", finalReviews);

        const completedOrders = await getOrderHistory("completed");
        setCanReview(
          completedOrders?.some((o) =>
            o.items?.some((i) => String(i.book_id) === String(id))
          )
        );
      } catch (error) {
        console.error(error);
        message.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const onFinishReview = async (values) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return message.error("Vui lòng đăng nhập");

      const payload = {
        user: userData.id,
        book: Number(id),
        rating: values.rate,
        comment: values.comment,
      };

      await createReview(payload);
      message.success("Cảm ơn bạn đã gửi đánh giá!");
      setIsModalOpen(false);

      const updatedReviews = await getReviewsByBook(id);
      setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
    } catch (error) {
      console.error(error);
      message.error("Gửi đánh giá thất bại");
    }
  };

  if (loading)
    return (
      <div className="loading-center beige-bg">
        <Spin size="large" />
      </div>
    );

  // Kiểm tra product tồn tại
  if (!product || Object.keys(product).length === 0)
    return (
      <div className="error-center beige-bg">
        <h2>Sản phẩm không tồn tại</h2>
      </div>
    );

  return (
    <div className="detail-page beige-bg">
      <Header />
      <div className="detail-container new-detail">
        <Breadcrumb className="detail-breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/books">Sách</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{formatTitle(product)}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="detail-card">
          <div className="detail-grid">
            <div className="detail-image-panel">
              <Image
                src={mainImage}
                fallback={defaultImg}
                className="detail-main-image"
                preview={false}
              />
              <div className="detail-thumbs">
                <Image
                  src={secondaryImage}
                  fallback={defaultImg}
                  preview={false}
                />
              </div>
            </div>

            <div className="detail-info-panel">
              <h1 className="detail-title">{formatTitle(product)}</h1>
              <p className="detail-author">
                Tác giả: <span>{formatAuthor(product)}</span>
              </p>

              <div className="detail-rating-row">
                <Rate disabled value={Number(ratingStats.average) || 0} />
                <span className="detail-rating-count">
                  ({ratingStats.count} nhận xét)
                </span>
              </div>

              <div className="detail-price-row">
                {originalValue &&
                  Number(originalValue) > Number(priceValue) && (
                    <span className="detail-price-old">
                      {formatCurrency.format(originalValue)}
                    </span>
                  )}
                <span className="detail-price">
                  {formatCurrency.format(priceValue)}
                </span>
              </div>

              <div className="detail-description-block">
                <span className="detail-description-label">Mô tả sách</span>
                <p className="detail-description">
                  "{formatDescription(product)}"
                </p>
              </div>

              <div className="detail-actions">
                <Button
                  type="primary"
                  size="large"
                  className="btn-buy-now"
                  onClick={() => {
                    addToCart(product);
                    navigate("/cart");
                  }}
                >
                  Mua ngay
                </Button>
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="btn-add-cart"
                  onClick={() => {
                    addToCart(product);
                    message.success("Đã thêm vào giỏ");
                  }}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  className="btn-wish"
                  onClick={() =>
                    message.success("Đã thêm vào danh sách yêu thích")
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="review-block modern-review">
          <div className="review-header">
            <h2>Đánh giá của người mua</h2>
            {canReview && (
              <Button type="primary" ghost onClick={() => setIsModalOpen(true)}>
                Gửi đánh giá
              </Button>
            )}
          </div>

          <div className="review-content-grid">
            {/* Phần thống kê sao giữ nguyên */}
            <div className="score-overview">
              <div className="score-big">
                {ratingStats.average || "0.0"}
                <span className="score-total">/5</span>
              </div>
              <Rate
                disabled
                value={Number(ratingStats.average) || 0}
                className="margin-v-10"
              />
              <div className="review-total">
                {ratingStats.count} lượt đánh giá
              </div>

              <div className="star-bars-container">
                {[5, 4, 3, 2, 1].map((s) => (
                  <div key={s} className="bar-item">
                    <span className="bar-label">{s} sao</span>
                    <div className="bar-bg">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${
                            ((ratingStats.stars[s] || 0) /
                              (ratingStats.count || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="bar-count">
                      {ratingStats.stars[s] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="comments-section">
              <List
                dataSource={reviews}
                locale={{ emptyText: "Chưa có đánh giá" }}
                renderItem={(item) => (
                  <div className="comment-card-item">
                    <Avatar className="user-avatar">
                      {/* Thêm optional chaining ?. để tránh lỗi nếu user_name null */}
                      {item.user_name ? item.user_name[0].toUpperCase() : "U"}
                    </Avatar>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="user-name">
                          {item.user_name || "Người dùng ẩn danh"}
                        </span>
                        <span className="comment-date">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "vi-VN"
                              )
                            : ""}
                        </span>
                      </div>
                      <Rate
                        disabled
                        value={Number(item.rating)}
                        style={{ fontSize: "10px" }}
                      />
                      <p className="comment-text text-start">
                        "{item.comment}"
                      </p>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <Modal
          title="VIẾT NHẬN XÉT"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          centered
          destroyOnHidden
        >
          <Form
            layout="vertical"
            onFinish={onFinishReview}
            initialValues={{ rate: 5 }}
          >
            <Form.Item
              name="rate"
              label="Xếp hạng"
              rules={[{ required: true }]}
            >
              <Rate />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Nhận xét"
              rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              size="large"
              style={{ backgroundColor: "#1890ff" }}
            >
              GỬI
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default DetailProduct;
