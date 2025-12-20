import './ProfilePage.css'

export default function ProfilePage({ user, onBack, onLogout }) {
  const profile = user || {}
  const initials = (profile.fullname || profile.email || 'U').charAt(0).toUpperCase()

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
          <div className="info-row">
            <span className="label">Họ tên</span>
            <span className="value">{profile.fullname || 'Chưa cập nhật'}</span>
          </div>
          <div className="info-row">
            <span className="label">Email</span>
            <span className="value">{profile.email || 'Chưa cập nhật'}</span>
          </div>
          <div className="info-row">
            <span className="label">Số điện thoại</span>
            <span className="value">{profile.phone_number || 'Chưa cập nhật'}</span>
          </div>
          <div className="info-row">
            <span className="label">Vai trò</span>
            <span className="value">{profile.role_id === 1 ? 'Admin' : 'Customer'}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button type="button" className="btn secondary" onClick={onBack}>
            Về trang chủ
          </button>
          <button type="button" className="btn" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  )
}

