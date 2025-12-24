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
      <div className="loading-center">
        <Spin size="large" />
      </div>
    );

  // Kiểm tra product tồn tại
  if (!product || Object.keys(product).length === 0)
    return (
      <div className="error-center">
        <h2>Sản phẩm không tồn tại</h2>
      </div>
    );

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-container">
        <Breadcrumb className="custom-breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/books">Sách</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="product-main-card">
          <div className="product-image-section">
            <div className="image-wrapper">
              <Image src={product.image || defaultImg} fallback={defaultImg} />
            </div>
            <div className="badge-list">
              <Tag color="blue" icon={<CheckCircleOutlined />}>
                Chính hãng
              </Tag>
              <Tag color="volcano" icon={<ThunderboltOutlined />}>
                Giao nhanh
              </Tag>
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-name">{product.name}</h1>
            <p className="author-name text-start">
              Tác giả: <span>{product.author || "Nhiều tác giả"}</span>
            </p>

            <div className="rating-summary-row">
              <Rate disabled value={Number(ratingStats.average)} />
              <span className="count-text">
                ({ratingStats.count} đánh giá khách quan)
              </span>
            </div>

            {/* --- SỬA 4: Ép kiểu Number để tránh lỗi NaN --- */}
            <div className="price-row">
              <span className="price-current">
                {product.price
                  ? formatCurrency.format(Number(product.price))
                  : "Liên hệ"}
              </span>
              {Number(product.original_price) > Number(product.price) && (
                <span className="price-original">
                  {formatCurrency.format(Number(product.original_price))}
                </span>
              )}
            </div>

            <Divider />
            <div className="description-section">
              <h3>TÓM LƯỢC NỘI DUNG</h3>
              <p className="text-start">
                "{product.description || "Đang cập nhật..."}"
              </p>
            </div>

            <div className="action-group">
              <Button
                type="primary"
                size="large"
                className="btn-buy-now"
                onClick={() => {
                  addToCart(product);
                  navigate("/cart");
                }}
              >
                MUA NGAY
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
                THÊM GIỎ HÀNG
              </Button>
              <Button
                size="large"
                icon={<HeartOutlined />}
                className="btn-wish"
              />
            </div>
          </div>
        </div>

        <div className="review-block">
          <div className="review-header">
            <h2>ĐÁNH GIÁ NGƯỜI MUA</h2>
            {canReview && (
              <Button type="primary" ghost onClick={() => setIsModalOpen(true)}>
                Gửi đánh giá
              </Button>
            )}
          </div>

          <div className="review-content-grid">
            {/* Phần thống kê sao giữ nguyên */}
            <div className="score-overview">
              <div className="score-big">{ratingStats.average}</div>
              <Rate
                disabled
                value={Number(ratingStats.average)}
                className="margin-v-10"
              />
              <div className="review-total">{ratingStats.count} nhận xét</div>

              <div className="star-bars-container">
                {[5, 4, 3, 2, 1].map((s) => (
                  <div key={s} className="bar-item">
                    <span className="bar-label">{s}★</span>
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
                // Thêm check empty để hiện thông báo nếu chưa có review
                locale={{ emptyText: "Chưa có đánh giá nào." }}
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
