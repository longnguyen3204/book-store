import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { productDetail, listProduct } from "../../config/ProductRequest";
import { getOrderHistory } from "../../api/orderApi";
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
} from "antd";
import { HomeOutlined, HeartOutlined } from "@ant-design/icons";
import "./review.css";
import defaultImg from "../../assets/images/default.png";
import { useCart } from "../../context/CartContext";

function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Biến canReview dùng để kiểm soát việc hiển thị nút
  const [canReview, setCanReview] = useState(false);

  const formatCurrency = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    []
  );

  // Logic kiểm tra quyền đánh giá từ API đơn hàng
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const completedOrders = await getOrderHistory("completed");
        if (Array.isArray(completedOrders)) {
          // Tìm xem có sản phẩm này trong các đơn hàng đã hoàn thành không
          const hasPurchased = completedOrders.some((order) =>
            order.items?.some((item) => String(item.book_id) === String(id))
          );

          setCanReview(hasPurchased);

          // Nếu có quyền và đi từ trang history sang thì mở modal ngay
          if (hasPurchased && location.state?.openReview) {
            setIsModalOpen(true);
            window.history.replaceState({}, document.title);
          }
        }
      } catch (error) {
        console.error("Lỗi kiểm tra quyền đánh giá:", error);
      }
    };
    checkPurchaseStatus();
  }, [id, location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await productDetail(id);
        if (res.metadata.product) {
          setProduct(res.metadata.product);
          const all = await listProduct();
          setRelatedProducts(
            all.filter((item) => String(item.id) !== String(id)).slice(0, 4)
          );
        } else {
          message.error("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        message.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const onFinishReview = (values) => {
    console.log("Dữ liệu đánh giá:", values);
    message.success("Cảm ơn bạn đã gửi đánh giá!");
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f2ee]">
        <Spin size="large" />
      </div>
    );
  if (!product)
    return (
      <div className="pt-40 text-center bg-[#f4f2ee] h-screen">
        <h2>Sản phẩm không tồn tại</h2>
      </div>
    );

  return (
    <div className="bg-[#f4f2ee] min-h-screen pb-20 pt-40">
      <Header />
      <div className="container mx-auto px-4 pt-32">
        <Breadcrumb
          className="mb-6 opacity-40 uppercase tracking-[0.2em]"
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined />
                </Link>
              ),
            },
            { title: <Link to="/books">Sách</Link> },
            { title: <span className="breadcrumb-item">{product.title}</span> },
          ]}
        />

        {/* Khối thông tin sản phẩm */}
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden mb-12 border border-white">
          <div style={{ display: "flex", gap: 60 }}>
            <div
              className="col-md-3 text-center bg-[#f4f2ee]"
              style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}
            >
              <Image
                style={{
                  width: "100%",
                  maxHeight: 450,
                  objectFit: "contain",
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 40,
                }}
                src={
                  product.imagesProduct?.[selectedImage] ||
                  product.image ||
                  defaultImg
                }
                fallback={defaultImg}
                preview={false}
              />
            </div>

            <div
              className="md:col-span-7 p-10 lg:p-16 flex flex-col gap-6"
              style={{ flex: 1 }}
            >
              <h1 className="text-4xl lg:text-5xl font-serif text-gray-800 leading-tight mb-5">
                {product.title}
              </h1>
              <p className="text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-0 text-left">
                Tác giả:{" "}
                <span className="text-blue-500 font-medium">
                  {product.author}
                </span>
              </p>

              <div className="flex items-center mt-2" style={{ gap: "12px" }}>
                {product.prevPrice &&
                  Number(product.prevPrice) > Number(product.price) && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: 16,
                      }}
                    >
                      {formatCurrency.format(product.prevPrice)}
                    </span>
                  )}
                <span style={{ fontSize: 24, color: "red", fontWeight: 700 }}>
                  {formatCurrency.format(product.price)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Rate
                  disabled
                  defaultValue={4.5}
                  className="text-sm text-yellow-400"
                />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  (12 nhận xét)
                </span>
              </div>

              <div className="bg-gray-50/80 p-6 lg:p-8 rounded-3xl relative mt-2 text-left">
                <span className="absolute -top-3 left-6 bg-white px-3 text-gray-300 font-serif text-lg italic uppercase tracking-tighter">
                  Mô tả sách
                </span>
                <p className="text-gray-500 leading-relaxed text-sm italic mb-0">
                  "
                  {product.description ||
                    product.descriptionProduct ||
                    "Chưa có mô tả."}
                  "
                </p>
              </div>

              <div
                className="flex w-full max-w-sm h-14 lg:h-16 mt-4"
                style={{ display: "flex", gap: 12 }}
              >
                <button
                  onClick={() => {
                    addToCart(product);
                    navigate("/cart");
                  }}
                  className="flex-1 bg-[#b19173] hover:bg-[#9d7b5b] text-white font-bold rounded-2xl uppercase tracking-widest"
                >
                  Mua ngay
                </button>
                <button
                  onClick={() => {
                    addToCart(product);
                    message.success("Đã thêm vào giỏ hàng");
                  }}
                  disabled={product.stockProduct === 0}
                  className="flex-[3] bg-[#0066ff] hover:bg-blue-700 text-white font-bold rounded-2xl uppercase tracking-widest disabled:bg-gray-300"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  className="flex-1 hover:bg-red-50 text-red-400 flex items-center justify-center rounded-2xl border border-gray-100 shadow-sm"
                  onClick={() => message.success("Đã thêm vào yêu thích")}
                >
                  <HeartOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Khối đánh giá người mua */}
        <div className="bg-white rounded-[40px] p-16 shadow-sm mb-12">
          <h2 className="text-3xl font-serif mb-12 text-gray-800 text-center uppercase tracking-widest opacity-80">
            Đánh giá của người mua
          </h2>

          {/* LOGIC HIỂN THỊ NÚT: Chỉ hiện khi canReview === true */}
          {canReview && (
            <div className="text-center mb-10">
              <Button
                type="primary"
                size="large"
                onClick={() => setIsModalOpen(true)}
              >
                Viết đánh giá của bạn
              </Button>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div className="rating-summary">
              <div className="rating-overview">
                <h3>Đánh giá sản phẩm</h3>
                <div className="rating-score">
                  <span className="score">4.0</span>
                  <span className="total">/5</span>
                </div>
                <Rate disabled defaultValue={4} />
                <span className="rating-count">4 lượt đánh giá</span>
              </div>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-bar">
                    <span className="star-label">{star} sao</span>
                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: star === 5 ? "75%" : star === 1 ? "25%" : "0%",
                        }}
                      />
                    </div>
                    <span className="star-count">
                      {star === 5 ? 3 : star === 1 ? 1 : 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <List
              dataSource={[
                {
                  user: "Hoàng Nam",
                  content:
                    "Giao hàng nhanh, sách đẹp đúng mô tả. Rất đáng mua!",
                  rate: 5,
                },
                {
                  user: "Minh Thư",
                  content:
                    "Nội dung sách rất hay và ý nghĩa, mình học được nhiều điều mới.",
                  rate: 5,
                },
                {
                  user: "Quốc Bảo",
                  content:
                    "Bìa sách thiết kế sang trọng, giấy in chất lượng cao, rất hài lòng.",
                  rate: 4,
                },
                {
                  user: "Thu Thảo",
                  content:
                    "Đóng gói cẩn thận, nhân viên hỗ trợ nhiệt tình. Sẽ ủng hộ shop dài dài.",
                  rate: 5,
                },
              ]}
              renderItem={(item) => (
                <div
                  className="mb-10 pb-10 border-b border-gray-50 last:border-none"
                  style={{ margin: 20 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        size="large"
                        className="bg-blue-50 text-blue-400 font-bold"
                      >
                        {item.user[0]}
                      </Avatar>
                      <span className="font-bold text-sm text-gray-700 uppercase tracking-wider">
                        {item.user}
                      </span>
                    </div>
                    <Rate
                      disabled
                      defaultValue={item.rate}
                      className="text-[10px]"
                    />
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed pl-14 italic">
                    "{item.content}"
                  </p>
                </div>
              )}
            />
          </div>
        </div>

        {/* Modal đánh giá */}
        <Modal
          title={
            <span className="font-serif uppercase tracking-widest text-lg">
              Đánh giá sản phẩm
            </span>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          centered
          destroyOnClose
          width={600}
          zIndex={9999}
        >
          <Form
            layout="vertical"
            onFinish={onFinishReview}
            initialValues={{ rate: 5 }}
          >
            <Form.Item
              name="rate"
              label="Mức độ hài lòng"
              rules={[{ required: true }]}
            >
              <Rate style={{ fontSize: 30 }} />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Nội dung nhận xét"
              rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Chia sẻ cảm nhận của bạn..."
                className="rounded-xl"
              />
            </Form.Item>
            <Form.Item className="mb-0 text-right">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-[#0b74e5] px-10 rounded-xl font-bold uppercase"
              >
                Gửi nhận xét
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default DetailProduct;
