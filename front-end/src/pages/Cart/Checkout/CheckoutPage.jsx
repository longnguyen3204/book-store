import React, { useState } from 'react';
// Gộp tất cả các hook từ react-router-dom vào một dòng duy nhất
import { useNavigate, Link } from 'react-router-dom'; 
import './checkout.css';
import Header from "../../../components/Header";
import { PhoneOutlined } from '@ant-design/icons';
const CheckoutPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'Dương Ngân',
    phone: '0386905086',
    province: '',
    district: '',
    ward: '',
    address: '',
    addressType: 'home', // home hoặc office
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = () => {
  // 1. Hiển thị thông báo
  message.success('Đơn hàng đã được đặt thành công!');

  // 2. Thực hiện các logic khác (Ví dụ: Gọi API đặt hàng)
  // callApiOrder(data);

  // 3. Chuyển hướng người dùng về trang chủ hoặc danh sách đơn hàng sau 1-2 giây
  setTimeout(() => {
    navigate('/'); 
  }, 1500);
};
  return (
    <div className="checkout-bg">
        <Header />
      <div className="checkout-container">
        {/* Header Header logo giống Tiki */}
        <div className="checkout-header-step">
           
           <span className="divider">|</span>
           <span className="step-title">Địa chỉ giao hàng</span>
           <div className="hotline-box">
              {/* Thay thế ảnh cũ bằng icon Ant Design */}
              <PhoneOutlined className="hotline-icon-antd" />
              <div>
                <p className="hotline-num">1900-6035</p>
                <p className="hotline-sub">8h - 21h, cả T7 & CN</p>
              </div>
           </div>
        </div>

        <div className="checkout-content">
          
          <div className="white-card address-form-card">
            
            
            <div className="form-group-row">
              <label>Họ tên</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange}
                placeholder="Nhập họ tên" 
              />
            </div>

            <div className="form-group-row">
              <label>Điện thoại di động</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                placeholder="Nhập số điện thoại" 
              />
            </div>

            <div className="form-group-row">
              <label>Tỉnh/Thành phố</label>
              <select name="province" value={formData.province} onChange={handleChange}>
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option value="HN">Hà Nội</option>
                <option value="HCM">TP. Hồ Chí Minh</option>
              </select>
            </div>

            <div className="form-group-row">
              <label>Quận/Huyện</label>
              <select name="district" value={formData.district} onChange={handleChange}>
                <option value="">Chọn Quận/Huyện</option>
                <option value="TT">Thường Tín</option>
                <option value="PD">Phượng Dực</option>
                <option value="NK">Nam Kinh</option>

              </select>
            </div>

            <div className="form-group-row">
              <label>Phường/Xã</label>
              <select name="ward" value={formData.ward} onChange={handleChange}>
                <option value="">Chọn Phường/Xã</option>
                <option value="VH">Văn Hoàng</option>
                <option value="TT">Tri Trỉ</option>
                <option value="HL">Hoàng Long</option>

              </select>
            </div>

            <div className="form-group-row">
              <label>Địa chỉ</label>
              <textarea  rows="5"
                name="address" 
                placeholder="Ví dụ: 52, đường Trần Hưng Đạo" 
                value={formData.address}
                onChange={handleChange}
              />
              
            </div>

            <div className="form-group-row">
              <label>Loại địa chỉ</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="addressType" 
                    value="home" 
                    checked={formData.addressType === 'home'}
                    onChange={handleChange}
                  /> 
                  Nhà riêng / Chung cư
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="addressType" 
                    value="office" 
                    checked={formData.addressType === 'office'}
                    onChange={handleChange}
                  /> 
                  Cơ quan / Công ty
                </label>
              </div>
            </div>

            <div className="form-group-row offset-label">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="isDefault" 
                  checked={formData.isDefault}
                  onChange={handleChange}
                /> 
                Sử dụng địa chỉ này làm mặc định.
              </label>
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={() => navigate('/cart')}>Huỷ bỏ</button>
              <button className="btn-submit" onClick={() => navigate('/')}>Giao đến địa chỉ này</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;