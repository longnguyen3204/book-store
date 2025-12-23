import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './checkout.css';
import Header from "../../../components/Header";
import { getProfile, updateProfile } from "../../../api/authApi";
import { PhoneOutlined } from '@ant-design/icons';
import { message } from 'antd';
const CheckoutPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    addressType: 'home', // home hoặc office
    isDefault: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setFormData((prev) => ({
          ...prev,
          fullName: profile.fullname || prev.fullName || "",
          phone: profile.phone_number || prev.phone || "",
        }));
      } catch (e) {
        // nếu không lấy được profile, giữ form rỗng để người dùng nhập
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = async () => {
    const fullAddress = formData.address;
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();
    const addressKey = user?.id ? `addresses_${user.id}` : 'addresses_guest';

    try {
      await updateProfile({
        fullname: formData.fullName,
        phone_number: formData.phone,
        address: fullAddress,
      });
      // Lưu địa chỉ vào localStorage cho dropdown địa chỉ
      const storedList = (() => {
        try {
          return JSON.parse(localStorage.getItem(addressKey)) || [];
        } catch {
          return [];
        }
      })();
      const newAddress = {
        id: Date.now(),
        fullName: formData.fullName,
        phone: formData.phone,
        address: fullAddress,
        addressType: formData.addressType,
        isDefault: formData.isDefault,
      };
      const exists = storedList.some(
        (item) =>
          item.fullName === newAddress.fullName &&
          item.phone === newAddress.phone &&
          item.address === newAddress.address
      );
      const updatedList = exists ? storedList : [newAddress, ...storedList];
      localStorage.setItem(addressKey, JSON.stringify(updatedList));

      message.success("Đã lưu địa chỉ cho tài khoản");
      navigate('/cart', {
        state: {
          savedAddress: {
            ...newAddress,
          }
        }
      });
    } catch (err) {
      message.error(err.message || "Lưu địa chỉ thất bại");
    }
  };
  return (
    <div className="checkout-bg">
        <Header />
      <div className="checkout-container">
        {/* Header Header logo giống Tiki */}
        <div className="checkout-header-step">
           
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
              <label>Địa chỉ</label>
              <textarea  rows="5"
                name="address" 
                placeholder="Ví dụ: 52, đường Trần Hưng Đạo" 
                value={formData.address}
                onChange={handleChange}
              />
              
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
              <button className="btn-cancel" onClick={() => navigate(-1)}>Huỷ bỏ</button>
              <button className="btn-submit" onClick={handleSubmit}>Xác nhận địa chỉ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;