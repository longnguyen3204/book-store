import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import Header from "../../components/Header";
import "./cart.css";

// IMPORT API
import bookApi from "../../api/bookApi";
import orderApi from "../../api/orderApi";
import voucherApi from "../../api/voucherApi";

// IMPORT ICONS & UI LIBRARY
import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { message } from "antd";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Lấy thông tin User từ LocalStorage
  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Format tiền tệ VNĐ
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    []
  );

  const formatNumberToText = (num) => {
    if (!num) return "0";
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " triệu";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num.toString();
  };

  // Helper parse giá (xử lý trường hợp giá là string "100.000" hoặc number)
  const parsePrice = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = parseFloat(val.replace(/[^\d.-]/g, ""));
      return Number.isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // --- STATE QUẢN LÝ ---
  const [dbVouchers, setDbVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // ID các sản phẩm được tích chọn
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // 2. Xử lý địa chỉ: Ưu tiên lấy từ Checkout truyền về -> Nếu không có thì lấy từ User Profile
  const [selectedAddress, setSelectedAddress] = useState(() => {
    // Trường hợp 1: Vừa điền form ở Checkout quay lại
    if (location.state?.savedAddress) return location.state.savedAddress;

    // Trường hợp 2: Lấy từ database user (nếu có)
    if (user && user.address) {
      return {
        fullName: user.fullname || "Khách hàng",
        phone: user.phone_number || "",
        address: user.address, // Chuỗi địa chỉ từ DB
        // Các trường phụ có thể để trống nếu DB lưu full string
        ward: "",
        district: "",
        province: "",
      };
    }
    return null;
  });

  // 3. Fetch dữ liệu từ Database (Sách đề xuất & Voucher)
  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const [booksRes, vouchersRes] = await Promise.all([
          bookApi.getBooks(),
          voucherApi.fetchVouchers(),
        ]);

        // Xử lý danh sách sách để hiển thị "Có thể bạn sẽ thích"
        const rawBooks = booksRes.data || booksRes;
        const normalizedBooks = (Array.isArray(rawBooks) ? rawBooks : []).map(
          (item) => ({
            id: item.id,
            title: item.name || item.title || "Đang cập nhật",
            author: item.author || "Nhiều tác giả",
            price: item.price ?? 0,
            image:
              item.image || item.thumbnail || "https://via.placeholder.com/150",
          })
        );

        // Random lấy 4 sản phẩm
        setRecommendedProducts(normalizedBooks.sort(() => Math.random() - 0.5));

        // Set Voucher
        setDbVouchers(Array.isArray(vouchersRes) ? vouchersRes : []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchDbData();
  }, []);

  // 4. Tính toán tiền nong
  const subTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      if (!selectedIds.includes(String(item.id))) return sum;
      return sum + parsePrice(item.price) * (item.quantity || 0);
    }, 0);
  }, [cart, selectedIds]);

  const discountAmount = useMemo(() => {
    if (!selectedVoucher || subTotal < (selectedVoucher.min_order_value || 0))
      return 0;
    // Nếu giá trị <= 100 thì tính theo %, ngược lại là tiền mặt
    if (selectedVoucher.discount_value <= 100) {
      return (subTotal * Number(selectedVoucher.discount_value)) / 100;
    }
    return Number(selectedVoucher.discount_value);
  }, [subTotal, selectedVoucher]);

  const finalTotal = useMemo(
    () => Math.max(0, subTotal - discountAmount),
    [subTotal, discountAmount]
  );

  // 5. Xử lý chọn Voucher
  const handleSelectVoucher = (voucher) => {
    if (selectedVoucher?.id === voucher.id) {
      setSelectedVoucher(null); // Bỏ chọn
    } else {
      if (subTotal < (voucher.min_order_value || 0)) {
        message.warning(
          `Đơn hàng cần tối thiểu ${currencyFormatter.format(
            voucher.min_order_value
          )} để dùng mã này.`
        );
        return;
      }
      setSelectedVoucher(voucher);
    }
  };

  // 6. Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }
    if (selectedIds.length === 0) {
      message.error("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    if (!selectedAddress) {
      message.error("Vui lòng cập nhật địa chỉ giao hàng");
      navigate("/checkout"); // Chuyển sang trang nhập địa chỉ
      return;
    }

    // Chuẩn bị Items
    const items = cart
      .filter((i) => selectedIds.includes(String(i.id)))
      .map((i) => ({
        book_id: i.id,
        quantity: i.quantity || 1,
        price: parsePrice(i.price),
      }));

    // Chuẩn bị chuỗi địa chỉ
    // Nếu selectedAddress là object từ Checkout thì gộp lại, nếu là string từ DB thì giữ nguyên
    let shippingStr = "";
    if (typeof selectedAddress === "string") {
      shippingStr = selectedAddress;
    } else {
      shippingStr = `${selectedAddress.fullName} | ${selectedAddress.phone} | ${selectedAddress.address}`;
      if (selectedAddress.ward) shippingStr += `, ${selectedAddress.ward}`;
      if (selectedAddress.district)
        shippingStr += `, ${selectedAddress.district}`;
      if (selectedAddress.province)
        shippingStr += `, ${selectedAddress.province}`;
    }

    try {
      await orderApi.createOrder({
        items,
        shipping_address: shippingStr,
        total_amount: finalTotal,
        payment_method_id: 1, // Mặc định COD
        voucher_id: selectedVoucher ? selectedVoucher.id : null,
      });

      message.success("Đặt hàng thành công!");

      // Xóa các sản phẩm đã mua khỏi giỏ
      selectedIds.forEach((id) => removeFromCart(Number(id)));

      navigate("/order-history");
    } catch (err) {
      message.error(err.message || "Đặt hàng thất bại, vui lòng thử lại");
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
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM & ĐỀ XUẤT */}
          <div className="cart-left-section">
            {/* Nếu giỏ hàng trống */}
            {cart.length === 0 ? (
              <div className="white-card empty-state-card text-center py-5">
                <p>Giỏ hàng của bạn đang trống.</p>
                <button
                  onClick={() => navigate("/")}
                  className="checkout-primary-btn w-auto px-4 mt-3"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <>
                {/* Header Bảng Giỏ hàng */}
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
                  <span className="col-action">
                    <DeleteOutlined />
                  </span>
                </div>

                {/* Danh sách Items */}
                <div className="white-card shop-group">
                  <div className="shop-header">
                    <span className="shop-name">BOOKSAW STORE</span>
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
                              if (!isNaN(val) && val > 0)
                                updateQuantity(item.id, val);
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
                      </div>

                      <div className="item-subtotal text-danger fw-bold">
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

            {/* SẢN PHẨM CÓ THỂ THÍCH*/}
            <div className="white-card recommendation-section mt-4">
              <h3 className="section-label">Sản phẩm có thể bạn thích</h3>
              <div className="recommendation-grid">
                {recommendedProducts.map((book) => (
                  <div
                    key={book.id}
                    className="rec-item"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <div className="rec-img-wrapper">
                      <img
                        src={book.image}
                        alt={book.title}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
                    </div>
                    <p className="rec-title">{book.title}</p>
                    <div className="rec-price">
                      {currencyFormatter.format(book.price)}
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

          {/* CỘT PHẢI: THANH TOÁN & ĐỊA CHỈ */}
          <div className="cart-right-section">
            {/* Box Địa chỉ */}
            <div className="white-card address-summary">
              <div className="address-summary-header">
                <span className="address-title">📍 Địa Chỉ Nhận Hàng</span>
                <button
                  className="address-edit"
                  onClick={() => navigate("/checkout")}
                >
                  {selectedAddress ? "Thay đổi" : "Nhập Địa chỉ"}
                </button>
              </div>
              {selectedAddress ? (
                <div className="address-info mt-2">
                  <div className="fw-bold">
                    {selectedAddress.fullName} | {selectedAddress.phone} |
                  </div>
                  <div className="fw-bold text-muted text-truncate">
                    {typeof selectedAddress === "string"
                      ? selectedAddress
                      : selectedAddress.address}
                  </div>
                </div>
              ) : (
                <p className="small text-muted mt-2">
                  Vui lòng cập nhật địa chỉ để mua hàng.
                </p>
              )}
            </div>

            {/* Box Voucher */}
            <div className="white-card coupon-section mt-3">
              <span className="coupon-title">
                Mã Giảm Giá ({dbVouchers.length})
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
                        <p className="v-code fw-bold">{v.code}</p>
                        <p className="v-desc small">
                          Giảm{" "}
                          {v.discount_value <= 100
                            ? `${v.discount_value}%`
                            : formatNumberToText(v.discount_value)}{" "}
                          cho đơn từ {formatNumberToText(v.min_order_value)}
                        </p>
                        <button
                          className="btn-apply-coupon"
                          onClick={() => handleSelectVoucher(v)}
                        >
                          {selectedVoucher?.id === v.id ? "Bỏ chọn" : "Áp dụng"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="small text-muted">Không có mã giảm giá nào.</p>
                )}
              </div>
            </div>

            {/* Box Tổng tiền */}
            <div className="white-card summary-box mt-3">
              <div className="summary-line d-flex justify-content-between">
                <span>Tạm tính</span>
                <span>{currencyFormatter.format(subTotal)}</span>
              </div>
              {selectedVoucher && discountAmount > 0 && (
                <div className="summary-line d-flex justify-content-between text-success mt-1">
                  <span>Khuyến mãi</span>
                  <span>-{currencyFormatter.format(discountAmount)}</span>
                </div>
              )}
              <div className="summary-line highlight d-flex justify-content-between mt-3 pt-3 border-top">
                <span className="label fw-bold">Tổng thanh toán</span>
                <span className="total-val text-danger fw-bold fs-5">
                  {currencyFormatter.format(finalTotal)}
                </span>
              </div>
              <button
                className="checkout-primary-btn w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={selectedIds.length === 0}
                style={{ opacity: selectedIds.length === 0 ? 0.6 : 1 }}
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
