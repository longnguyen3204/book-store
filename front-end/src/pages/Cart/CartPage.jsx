import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react"; // Chỉ để 1 dòng import useState ở đây
import "./cart.css";
import Header from '../../components/Header';
import { featuredBooks } from "../../data/content.js";
import { 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined 
} from '@ant-design/icons';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  // Quản lý trạng thái Voucher
  const [appliedCoupons, setAppliedCoupons] = useState({
    tiki3: false,
    freeship: false
  });

  // Quản lý các mặt hàng được chọn
  const [selectedIds, setSelectedIds] = useState(() => cart.map((i) => String(i.id)));
  
  const recommendedProducts = useMemo(() => featuredBooks.slice(0, 4), []);

  const toggleCoupon = (couponKey) => {
    setAppliedCoupons(prev => ({
      ...prev,
      [couponKey]: !prev[couponKey]
    }));
  };

  useEffect(() => {
    const idsInCart = cart.map((i) => String(i.id));
    setSelectedIds((prev) => prev.filter((id) => idsInCart.includes(id)));
  }, [cart]);

  // Tính tổng tiền thanh toán
  const selectedTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const id = String(item.id);
      if (!selectedIds.includes(id)) return sum;
      
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
        : (item.price || 0);
        
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
                    <span className="shop-name">🏠 BOOKSAW</span>
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
                        {typeof item.price === 'string' ? item.price : `${item.price?.toLocaleString()}₫`}
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
                        {(() => {
                            const price = typeof item.price === 'string' 
                            ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
                            : (item.price || 0);
                            return (price * item.quantity).toLocaleString();
                        })()}$
                      </div>

                      <div className="item-action">
                        <DeleteOutlined className="btn-remove-item" onClick={() => removeFromCart(item.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Sản phẩm mua kèm */}
            <div className="white-card recommendation-section">
              <h3 className="section-label">Sản phẩm mua kèm</h3>
              <div className="recommendation-grid">
                {recommendedProducts.map((book, index) => (
                  <div key={index} className="rec-item">
                    <div className="rec-img-wrapper">
                        <img src={book.image} alt={book.title} />
                    </div>
                    <p className="rec-title">{book.title}</p>
                    <div className="rec-price">
                      {typeof book.price === 'number' ? book.price.toLocaleString() : book.price}
                    </div>
                    <button 
                      className="btn-add-rec"
                      onClick={() => addToCart({...book, id: book.id || book.title, quantity: 1})}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cart-right-section">
            <div className="white-card coupon-section">
                <div className="coupon-header">
                  <span className="coupon-title">Voucher Khuyến Mãi</span>
                  <span className="coupon-max">Có thể chọn 2 <i className="info-icon">i</i></span>
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
                <span className="val">{selectedTotal.toLocaleString()}$</span>
              </div>
              <div className="summary-line highlight">
                <span className="label">Tổng tiền thanh toán</span>
                <div className="val-group">
                  <span className="total-val">{selectedTotal.toLocaleString()}$</span>
                  <p className="vat-hint">(Đã bao gồm VAT nếu có)</p>
                </div>
              </div>
              <button 
                className="checkout-primary-btn"
                disabled={selectedIds.length === 0}
                onClick={() => navigate("/checkout", { state: { selectedItems: cart.filter(i => selectedIds.includes(String(i.id))) } })}
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