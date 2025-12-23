import './ProfilePage.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile as updateProfileApi } from "../../../api/authApi";

export default function ProfilePage({ user, onBack, onLogout, setUser }) {
  const navigate = useNavigate();
  // Trạng thái chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  
  // Dữ liệu tạm thời khi đang nhập liệu
  const [formData, setFormData] = useState({
    id: user?.id,
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  });

  const profile = user || {};
  const initials = (profile.fullname || profile.email || 'U').charAt(0).toUpperCase();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfileApi({
        fullname: formData.fullname,
        phone_number: formData.phone_number,
        address: formData.address,
      });
      alert("Cập nhật thành công!");
      
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser?.(updatedUser); 
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">{initials}</div>
          <div>
            <div className="profile-name">{profile.fullname || 'Khách hàng'}</div>
            <div className="profile-email">{profile.email || '—'}</div>
          </div>
        </div>

        <div className="profile-body">
          {/* Hàng Họ tên */}
          <div className="info-row">
            <span className="label">Họ tên</span>
            {isEditing ? (
              <input 
                type="text" 
                name="fullname" 
                className="edit-input"
                value={formData.fullname} 
                onChange={handleChange} 
              />
            ) : (
              <span className="value">{profile.fullname || 'Chưa cập nhật'}</span>
            )}
          </div>

          {/* Hàng Email */}
          <div className="info-row">
            <span className="label">Email</span>
            {isEditing ? (
              <input 
                type="email" 
                name="email" 
                className="edit-input"
                value={formData.email} 
                onChange={handleChange} 
              />
            ) : (
              <span className="value">{profile.email || 'Chưa cập nhật'}</span>
            )}
          </div>

          {/* Hàng Số điện thoại */}
          <div className="info-row">
            <span className="label">Số điện thoại</span>
            {isEditing ? (
              <input 
                type="text" 
                name="phone_number" 
                className="edit-input"
                value={formData.phone_number} 
                onChange={handleChange} 
              />
            ) : (
              <span className="value">{profile.phone_number || 'Chưa cập nhật'}</span>
            )}
          </div>

          {/* Hàng Địa chỉ */}
          <div className="info-row">
            <span className="label">Địa chỉ</span>
            {isEditing ? (
              <input 
                type="text" 
                name="address" 
                className="edit-input"
                value={formData.address || ""} 
                onChange={handleChange} 
              />
            ) : (
              <span className="value">{profile.address || 'Chưa cập nhật'}</span>
            )}
          </div>

          {/* Hàng Vai trò (Không cho phép sửa) */}
          <div className="info-row">
            <span className="label">Vai trò</span>
            <span className="value">{profile.role_id === 1 ? 'Admin' : 'Customer'}</span>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button type="button" className="btn" onClick={handleSave}>
                Lưu thay đổi
              </button>
              <button type="button" className="btn secondary" onClick={() => setIsEditing(false)}>
                Hủy
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  if (window.history.length > 1) navigate(-1);
                  else onBack?.();
                }}
              >
                Quay lại
              </button>
              <button type="button" className="btn outline" onClick={onLogout} style={{marginTop: '10px'}}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
