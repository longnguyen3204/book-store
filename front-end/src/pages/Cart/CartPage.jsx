import { useCart } from "../../context/CartContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react"; // Chỉ để 1 dòng import useState ở đây
import "./cart.css";
import Header from '../../components/Header';
import { featuredBooks } from "../../data/content.js";
import { getBooks } from "../../api/bookApi";
import { createOrder } from "../../api/orderApi";
import { 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined 
} from '@ant-design/icons';
import { message } from "antd";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, addToCart } = useCart();
  const location = useLocation();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const addressKey = user?.id ? `addresses_${user.id}` : "addresses_guest";
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
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
  const navigate = useNavigate();

  // Quản lý trạng thái Voucher
  const [appliedCoupons, setAppliedCoupons] = useState({
    tiki3: false,
    freeship: false
  });

  // Nhận địa chỉ từ Checkout nếu có
  const savedAddress = location.state?.savedAddress;

  // Quản lý các mặt hàng được chọn
  const [selectedIds, setSelectedIds] = useState(() => cart.map((i) => String(i.id)));
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(location.state?.savedAddress || null);
  
  const [recommendedProducts, setRecommendedProducts] = useState(() => featuredBooks.slice(0, 4));

  const toggleCoupon = (couponKey) => {
    setAppliedCoupons(prev => ({
      ...prev,
      [couponKey]: !prev[couponKey]
    }));
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
      await createOrder({
        items,
        shipping_address: selectedAddress.address,
        note: "",
        payment_method_id: null,
        voucher_id: null,
      });
      message.success("Đặt hàng thành công");
      navigate("/order-history");
    } catch (err) {
      message.error(err.message || "Đặt hàng thất bại");
    }
  };

  useEffect(() => {
    const idsInCart = cart.map((i) => String(i.id));
    setSelectedIds((prev) => prev.filter((id) => idsInCart.includes(id)));
  }, [cart]);

  useEffect(() => {
    const stored = (() => {
      try {
        const raw = JSON.parse(localStorage.getItem(addressKey)) || [];
        return raw.map((a, idx) => ({ id: a.id ?? idx, ...a }));
      } catch {
        return [];
      }
    })();

    // Nếu có địa chỉ mới từ checkout, thêm vào đầu danh sách
    const incoming = location.state?.savedAddress;
    let merged = stored;
    if (incoming) {
      const dup = stored.some(
        (a) =>
          a.fullName === incoming.fullName &&
          a.phone === incoming.phone &&
          a.address === incoming.address
      );
      const withId = { id: incoming.id ?? Date.now(), ...incoming };
      merged = dup ? stored : [withId, ...stored];
      localStorage.setItem(addressKey, JSON.stringify(merged));
    }

    setAddresses(merged);
    if (incoming) setSelectedAddress(incoming);
    else if (!selectedAddress && merged.length) setSelectedAddress(merged[0]);
  }, [addressKey, location.state, selectedAddress]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await getBooks();
        const normalized = (data || []).map((item) => ({
          id: item.id,
          title: item.name || item.title || "Đang cập nhật",
          author: item.author || "Đang cập nhật",
          price: item.price ?? item.original_price ?? 0,
          image: item.image || item.thumbnail || "",
        }));
        const shuffled = normalized.sort(() => Math.random() - 0.5);
        setRecommendedProducts(shuffled.slice(0, 4));
      } catch (error) {
        // Giữ fallback dữ liệu tĩnh nếu gọi API lỗi
        setRecommendedProducts(featuredBooks.slice(0, 4));
      }
    };

    fetchRecommended();
  }, []);

  // Tính tổng tiền thanh toán
  const selectedTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const id = String(item.id);
      if (!selectedIds.includes(id)) return sum;
      
      const price = parsePrice(item.price);
      return sum + price * (item.quantity || 0);
    }, 0);
  }, [cart, selectedIds]);

  const toggleAll = (checked) => {
    if (checked) setSelectedIds(cart.map(i => String(i.id)));
    else setSelectedIds([]);
  };

  return (
    <div className="cart-page-bg">
      <Header />
      
      <div className="cart-container-main">
        <h2 className="main-title">GIỎ HÀNG <span>({cart.length} sản phẩm)</span></h2>
        
        <div className="cart-flex-layout">
          <div className="cart-left-section">
            {cart.length === 0 ? (
              <div className="white-card empty-state-card">
                <p>Giỏ hàng của bạn đang trống.</p>
                <button 
                  onClick={() => navigate("/")}
                  className="checkout-primary-btn"
                  style={{ width: "auto", padding: "10px 30px", marginTop: "30px", marginLeft: "auto", display: "block" }}
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
                      checked={selectedIds.length === cart.length && cart.length > 0} 
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Tất cả ({cart.length} sản phẩm)
                  </label>
                  <span className="col-price">Đơn giá</span>
                  <span className="col-qty">Số lượng</span>
                  <span className="col-total">Thành tiền</span>
                  <div className="spacer-delete"></div>
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
                              if (e.target.checked) setSelectedIds((prev) => [...prev, id]);
                              else setSelectedIds((prev) => prev.filter((x) => x !== id));
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <img src={item.image} alt={item.title} className="item-thumb" />
                        <div className="item-text">
                          <p className="item-title-link">{item.title}</p>
                          <p className="item-subtitle">Tác giả: {item.author}</p>
                        </div>
                      </div>

                      <div className="item-unit-price">
                        {currencyFormatter.format(parsePrice(item.price))}
                      </div>

                      <div className="item-quantity-control">
                        <div className="qty-stepper">
                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                              <MinusOutlined />
                            </button>
                            <input type="text" value={item.quantity} readOnly />
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <PlusOutlined />
                            </button>
                        </div>
                        <p className="qty-note">Còn 3 sản phẩm</p>
                      </div>

                      <div className="item-subtotal">
                        {currencyFormatter.format(parsePrice(item.price) * item.quantity)}
                      </div>

                      <div className="item-action">
                        <DeleteOutlined className="btn-remove-item" onClick={() => removeFromCart(item.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Sản phẩm bạn có thể thích */}
            <div className="white-card recommendation-section">
              <h3 className="section-label">Sản phẩm bạn có thể thích</h3>
              <div className="recommendation-grid">
                {recommendedProducts.map((book, index) => (
                  <div 
                    key={index} 
                    className="rec-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/books/${book.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/books/${book.id}`);
                    }}
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
                        addToCart({...book, id: book.id || book.title, quantity: 1});
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
            {selectedAddress ? (
              <div className="white-card address-summary">
                <div className="address-summary-header">
                  <div className="address-title-group">
                    <span className="address-icon">📍</span>
                    <span className="address-title">Địa Chỉ Giao Hàng</span>
                  </div>
                  <button className="address-edit" onClick={() => navigate("/checkout")}>Đổi</button>
                </div>
                <div className="address-info">
                  <span className="address-name">{selectedAddress.fullName} - {selectedAddress.phone}</span>
                  {selectedAddress.isDefault && <span className="address-tag">Mặc định</span>}
                </div>
                <p className="address-line">
                  {[
                    selectedAddress.address,
                    selectedAddress.ward,
                    selectedAddress.district,
                    selectedAddress.province
                  ].filter(Boolean).join(", ")}
                </p>
                <button className="address-add-new" onClick={() => navigate("/checkout")}>+ Thêm địa chỉ mới</button>
              </div>
            ) : (
              <div 
                className="white-card address-card" 
                role="button" 
                tabIndex={0}
                onClick={() => navigate("/checkout")}
                onKeyDown={(e) => { if (e.key === "Enter") navigate("/checkout"); }}
              >
                <div className="address-header">
                  <span className="address-title">Địa chỉ giao hàng</span>
                  <span className="address-change">Chọn / sửa</span>
                </div>
                <p className="address-line">Nhấn để chọn địa chỉ giao hàng và phương thức thanh toán</p>
              </div>
            )}

            <div className="white-card coupon-section">
                <div className="coupon-header">
                  <span className="coupon-title">Voucher Khuyến Mãi </span>
                  <span className="coupon-max">(Có thể chọn: 2) <i className="info-icon">i</i></span>
                </div>
                <div className="coupon-list">
                  <div className={`coupon-item blue ${appliedCoupons.tiki3 ? 'active' : ''}`}>
                    <div className="coupon-left">🎫</div>
                    <div className="coupon-right">
                      <p>Giảm 3% tối đa 100k</p>
                      <button 
                        className={`btn-apply-coupon ${appliedCoupons.tiki3 ? 'applied' : ''}`}
                        onClick={() => toggleCoupon('tiki3')}
                      >
                        {appliedCoupons.tiki3 ? "Bỏ chọn" : "Áp dụng"}
                      </button>
                    </div>
                  </div>
                  <div className={`coupon-item green ${appliedCoupons.freeship ? 'active' : ''}`}>
                    <div className="coupon-left">🚚</div>
                    <div className="coupon-right">
                      <p>Giảm 70K</p>
                      <button 
                        className={`btn-apply-coupon ${appliedCoupons.freeship ? 'applied' : ''}`}
                        onClick={() => toggleCoupon('freeship')}
                      >
                        {appliedCoupons.freeship ? "Bỏ chọn" : "Áp dụng"}
                      </button>
                    </div>
                  </div>
                </div>
            </div>

            <div className="white-card summary-box">
              <div className="summary-line">
                <span className="label">Tạm tính</span>
                <span className="val">{currencyFormatter.format(selectedTotal)}</span>
              </div>
              <div className="summary-line highlight">
                <span className="label">Tổng tiền thanh toán</span>
                <div className="val-group">
                  <span className="total-val">{currencyFormatter.format(selectedTotal)}</span>
                  <p className="vat-hint">(Đã bao gồm VAT nếu có)</p>
                </div>
              </div>
              <button 
                className="checkout-primary-btn"
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