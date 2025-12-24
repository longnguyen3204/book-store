import { useCart } from "./CartContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import "./cart.css";
import Header from "../../components/Header";

// IMPORT API
import bookApi from "../../api/bookApi";
import orderApi from "../../api/orderApi";
import voucherApi from "../../api/voucherApi";

import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { message } from "antd";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    []
  );

  const parsePrice = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = parseFloat(val.replace(/[^\d.-]/g, ""));
      return Number.isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const [dbVouchers, setDbVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(
    location.state?.savedAddress || null
  );
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Sync dữ liệu từ Database
  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const [booksData, vouchersData] = await Promise.all([
          bookApi.getBooks(),
          voucherApi.fetchVouchers(),
        ]);
        const normalized = (booksData || []).map((item) => ({
          id: item.id,
          title: item.name || item.title || "Đang cập nhật",
          author: item.author || "Đang cập nhật",
          price: item.price ?? 0,
          image: item.image || item.thumbnail || "",
        }));
        setRecommendedProducts(
          normalized.sort(() => Math.random() - 0.5).slice(0, 4)
        );
        setDbVouchers(vouchersData || []);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    fetchDbData();
  }, []);

  // 1. Tính Tạm tính (Tiền hàng chưa giảm)
  const subTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      if (!selectedIds.includes(String(item.id))) return sum;
      return sum + parsePrice(item.price) * (item.quantity || 0);
    }, 0);
  }, [cart, selectedIds]);

  // 2. Tính số tiền giảm giá (Xử lý cả % và số tiền mặt)
  const discountAmount = useMemo(() => {
    if (!selectedVoucher || subTotal < (selectedVoucher.min_order_value || 0))
      return 0;

    // Nếu giá trị giảm <= 100 thì coi là %, nếu > 100 coi là số tiền mặt (hoặc dựa vào trường discount_type nếu có)
    if (selectedVoucher.discount_value <= 100) {
      return (subTotal * Number(selectedVoucher.discount_value)) / 100;
    } else {
      return Number(selectedVoucher.discount_value);
    }
  }, [subTotal, selectedVoucher]);

  // 3. Tổng tiền thanh toán cuối cùng
  const finalTotal = useMemo(
    () => Math.max(0, subTotal - discountAmount),
    [subTotal, discountAmount]
  );
  const formatNumberToText = (num) => {
    if (!num || isNaN(num)) return "0";

    if (num >= 1000000) {
      const million = num / 1000000;
      // Trả về số nguyên nếu chia hết, hoặc lấy 1 số thập phân nếu cần (VD: 1.5 triệu)
      return Number.isInteger(million)
        ? `${million} triệu`
        : `${million.toFixed(1)} triệu`;
    }

    if (num >= 1000) {
      return `${num / 1000}k`;
    }

    return num.toString();
  };
  const handleSelectVoucher = (voucher) => {
    if (selectedVoucher?.id === voucher.id) {
      setSelectedVoucher(null);
    } else {
      // Kiểm tra điều kiện đơn hàng tối thiểu ngay khi bấm chọn
      if (subTotal < (voucher.min_order_value || 0)) {
        message.warning(
          `Đơn hàng chưa đủ tối thiểu ${currencyFormatter.format(
            voucher.min_order_value
          )}`
        );
        return;
      }
      setSelectedVoucher(voucher);
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedIds.length === 0) {
      message.error("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    if (!selectedAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng");
      navigate("/checkout");
      return;
    }

    const items = cart
      .filter((i) => selectedIds.includes(String(i.id)))
      .map((i) => ({
        book_id: i.id,
        quantity: i.quantity || 1,
      }));

    try {
      await orderApi.createOrder({
        items,
        shipping_address: `${selectedAddress.address}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`,
        note: "",
        payment_method_id: 1,
        voucher_id: selectedVoucher ? selectedVoucher.id : null, // Gửi ID voucher về server
      });
      message.success("Đặt hàng thành công");
      navigate("/order-history");
    } catch (err) {
      message.error(err.message || "Đặt hàng thất bại");
    }
  };

  const toggleAll = (checked) => {
    if (checked) setSelectedIds(cart.map((i) => String(i.id)));
    else setSelectedIds([]);
  };

  return (
    <div className="cart-page-bg">
      <Header />
      <div className="cart-container-main">
        <h2 className="main-title">
          GIỎ HÀNG <span>({cart.length} sản phẩm)</span>
        </h2>
        <div className="cart-flex-layout">
          <div className="cart-left-section">
            {cart.length === 0 ? (
              <div className="white-card empty-state-card text-center py-5">
                <p>Giỏ hàng trống.</p>
                <button
                  onClick={() => navigate("/")}
                  className="checkout-primary-btn w-auto px-4 mt-3"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <>
                <div className="white-card select-all-bar">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === cart.length && cart.length > 0
                      }
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
                    <span className="checkmark"></span> Tất cả ({cart.length}{" "}
                    sản phẩm)
                  </label>
                  <span className="col-price">Đơn giá</span>
                  <span className="col-qty">Số lượng</span>
                  <span className="col-total">Thành tiền</span>
                </div>
                <div className="white-card shop-group">
                  <div className="shop-header">
                    <span className="shop-name">BOOKSAW</span>
                  </div>
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-row">
                      <div className="item-details">
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(String(item.id))}
                            onChange={(e) => {
                              const id = String(item.id);
                              setSelectedIds((prev) =>
                                e.target.checked
                                  ? [...prev, id]
                                  : prev.filter((x) => x !== id)
                              );
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="item-thumb"
                        />
                        <div className="item-text">
                          <p className="item-title-link">{item.title}</p>
                          <p className="item-subtitle">
                            Tác giả: {item.author}
                          </p>
                        </div>
                      </div>
                      <div className="item-unit-price">
                        {currencyFormatter.format(parsePrice(item.price))}
                      </div>
                      <div className="item-quantity-control">
                        <div className="qty-stepper">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <MinusOutlined />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              // Cho phép để trống tạm thời khi đang gõ, hoặc nhập số > 0
                              if (!isNaN(val) && val > 0) {
                                updateQuantity(item.id, val);
                              } else if (e.target.value === "") {
                                updateQuantity(item.id, ""); // Giữ trống để người dùng nhập tiếp
                              }
                            }}
                            onBlur={(e) => {
                              // Khi nhấn ra ngoài, nếu trống hoặc lỗi thì reset về 1
                              const val = parseInt(e.target.value);
                              if (isNaN(val) || val <= 0) {
                                updateQuantity(item.id, 1);
                              }
                            }}
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <PlusOutlined />
                          </button>
                        </div>
                        <p className="qty-note">Còn hàng</p>
                      </div>
                      <div className="item-subtotal">
                        {currencyFormatter.format(
                          parsePrice(item.price) * item.quantity
                        )}
                      </div>
                      <div className="item-action">
                        <DeleteOutlined
                          className="btn-remove-item"
                          onClick={() => removeFromCart(item.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="white-card recommendation-section">
              <h3 className="section-label">Sản phẩm bạn có thể thích</h3>
              <div className="recommendation-grid">
                {recommendedProducts.map((book, index) => (
                  <div
                    key={index}
                    className="rec-item"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <div className="rec-img-wrapper">
                      <img src={book.image} alt={book.title} />
                    </div>
                    <p className="rec-title">{book.title}</p>
                    <div className="rec-price">
                      {currencyFormatter.format(parsePrice(book.price))}
                    </div>
                    <button
                      className="btn-add-rec"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ ...book, quantity: 1 });
                      }}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cart-right-section">
            <div className="white-card address-summary">
              <div className="address-summary-header">
                <span className="address-title">📍 Địa Chỉ Giao Hàng</span>
                <button
                  className="address-edit"
                  onClick={() => navigate("/checkout")}
                >
                  {selectedAddress ? "Đổi" : "Thêm"}
                </button>
              </div>
              {selectedAddress ? (
                <div className="address-info mt-2">
                  <span className="address-name">
                    {selectedAddress.fullName} - {selectedAddress.phone} -
                    {selectedAddress.address}
                  </span>
                </div>
              ) : (
                <p className="small text-muted mt-2">
                  Vui lòng chọn địa chỉ giao hàng
                </p>
              )}
            </div>

            <div className="white-card coupon-section mt-3 ">
              <span className="coupon-title">
                Voucher Hệ Thống ({dbVouchers.length})
              </span>
              <div className="coupon-list mt-2">
                {dbVouchers.length > 0 ? (
                  dbVouchers.map((v) => (
                    <div
                      key={v.id}
                      className={`coupon-item blue ${
                        selectedVoucher?.id === v.id ? "is_active" : ""
                      } ${
                        subTotal < (v.min_order_value || 0) ? "disabled" : ""
                      }`}
                    >
                      <div className="coupon-left">🎫</div>
                      <div className="coupon-right">
                        <p className="v-code">
                          Mã: {v.code} <br />
                          Tối thiểu: {formatNumberToText(v.min_order_value)}
                        </p>
                        <p className="v-value text-muted">
                          Giảm:{" "}
                          {v.discount_value <= 100
                            ? `${v.discount_value}%`
                            : formatNumberToText(v.discount_value)}
                        </p>
                        <button
                          className="btn-apply-coupon"
                          onClick={() => handleSelectVoucher(v)}
                        >
                          {selectedVoucher?.id === v.id ? "Bỏ" : "Dùng"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="small text-muted p-2">Hiện chưa có voucher</p>
                )}
              </div>
            </div>

            <div className="white-card summary-box mt-3">
              <div className="summary-line d-flex justify-content-between">
                <span>Tạm tính</span>
                <span>{currencyFormatter.format(subTotal)}</span>
              </div>
              {selectedVoucher && discountAmount > 0 && (
                <div className="summary-line d-flex justify-content-between text-success mt-2">
                  <span>
                    Giảm giá ({selectedVoucher.discount_value}
                    {selectedVoucher.discount_value <= 100 ? "%" : "đ"})
                  </span>
                  <span>-{currencyFormatter.format(discountAmount)}</span>
                </div>
              )}
              <div className="summary-line highlight d-flex justify-content-between mt-2 pt-3 border-top">
                <span className="label fw-bold">Tổng tiền thanh toán</span>
                <span className="total-val text-danger fw-bold fs-5">
                  {currencyFormatter.format(finalTotal)}
                </span>
              </div>
              <button
                className="checkout-primary-btn w-100 mt-3"
                disabled={selectedIds.length === 0}
                onClick={handlePlaceOrder}
              >
                MUA HÀNG ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
