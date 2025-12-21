// src/pages/Admin/UserManager.jsx
import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

const UserManager = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        adminApi.getAllUsers().then(res => setUsers(res.data));
    }, []);

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if(window.confirm(`Đổi quyền của ${user.name} thành ${newRole}?`)) {
            await adminApi.updateUserRole(user._id, newRole);
            setUsers(users.map(u => u._id === user._id ? {...u, role: newRole} : u));
        }
    };

    return (
        <div>
            <h2>Quản lý Người dùng</h2>
            <table className="table">
                <thead><tr><th>Tên</th><th>Email</th><th>Vai trò</th><th>Hành động</th></tr></thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-info btn-sm" onClick={() => toggleRole(user)}>
                                    Đổi vai trò
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManager;