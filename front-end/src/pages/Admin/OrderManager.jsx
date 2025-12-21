// src/pages/Admin/OrderManager.jsx
import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const res = await adminApi.getAllOrders();
        setOrders(res.data);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminApi.updateOrderStatus(id, newStatus);
            loadOrders(); // Tải lại dữ liệu sau khi update
        } catch (error) {
            alert("Lỗi cập nhật trạng thái");
        }
    };

    return (
        <div>
            <h2>Quản lý Đơn hàng</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Mã Đơn</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái hiện tại</th>
                        <th>Cập nhật trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user?.name || 'Guest'}</td>
                            <td>{order.totalPrice}</td>
                            <td>
                                <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>
                                <select 
                                    value={order.status} 
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="form-select form-select-sm"
                                >
                                    <option value="Pending">Chờ xử lý</option>
                                    <option value="Processing">Đang đóng gói</option>
                                    <option value="Shipped">Đang giao</option>
                                    <option value="Completed">Hoàn thành</option>
                                    <option value="Cancelled">Hủy</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManager;