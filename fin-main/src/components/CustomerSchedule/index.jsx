import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classNames/bind';
import styles from './PatientSchedule.module.scss';
const cx = classNames.bind(styles);
// ... other imports

function CustomerOrder() {
    const { id } = useParams(); // Lấy id của customer từ URL
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token); // Log token ra để kiểm tra
                console.log('ID:', id); // Log id ra để kiểm tra
                if (token) { // Kiểm tra xem có token hay không
                    const response = await axios.get(`http://localhost:3000/orders/filter?customerId=${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setOrders(response.data.sale);
                    console.log('Order:', response.data); // Log orders ra để kiểm tra
                } else {
                    console.error('No token found!'); // Log lỗi nếu không có token
                    // Có thể redirect user về trang login hoặc hiển thị thông báo lỗi
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho user
            }
        };

        fetchOrders();
    }, [id]);
    const handleEdit = async (order) => {
        try {
            const token = localStorage.getItem('token');
            const orderID = order['Order ID']; // Lấy Order ID của đơn hàng

            if (token) {
                const response = await axios.patch(
                    `http://localhost:3000/sales/changeStatus/${orderID}`,
                    {}, // Có thể gửi data nếu cần thiết
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Update status response:', response.data);

                // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
                const updatedOrders = orders.map((o) =>
                    o['Order ID'] === orderID ? { ...o, Status: response.data.order.Status } : o
                );
                setOrders(updatedOrders);
            } else {
                console.error('No token found!');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };
    const handleCancel = async (order) => {
        try {
            const token = localStorage.getItem('token');
            const orderID = order['Order ID'];

            if (token) {
                // Gọi API để hủy đơn hàng
                const response = await axios.patch(
                    `http://localhost:3000/sales/changeStatus/${orderID}`,
                    { status: 'Cancelled' }, // Hoặc giá trị tương ứng với "Hủy"
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Update status response:', response.data);

                // Cập nhật lại danh sách đơn hàng
                const updatedOrders = orders.map((o) =>
                    o['Order ID'] === orderID ? { ...o, Status: response.data.order.Status } : o
                );
                setOrders(updatedOrders);
            } else {
                console.error('No token found!');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };
    // ... (Phần render)
    return (
        <div className={cx('wrapper')}>

            <div className={cx('navbar')}>

                <Link to={`/customer-detail/${id}`} className={cx('list-btn')}>
                    Thoát
                </Link>
            </div>
            <p className={cx('title')}>LỊCH SỬ ĐƠN HÀNG</p>
            <p className={cx('title')}>Khách hàng: {id} </p>

            <table className={cx('history-table')}>
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Thời gian tạo</th>
                    <th>Mã SKU sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Mã ship</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Duyệt</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? orders.map((order, index) => (
                    <tr key={order['Order ID']}>
                        <td>{index + 1}</td>
                        <td>{order['Order ID']}</td>
                        <td>{order.Date}</td>
                        <td>{order.SKU}</td>
                        <td>{order.Qty}</td>
                        <td>{order['ship-postal-code']}</td>
                        <td>{order.Amount + ".000"}</td>
                        <td>{order.Status}</td>
                        <td>
                            {order.Status !== "Delivered" ? (
                                <>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(order)}
                                        style={{
                                            fontSize: "16px",
                                            color: "#a855f7",
                                            background: "none",
                                            border: "none",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleCancel(order)}
                                        style={{
                                            fontSize: "16px",
                                            color: "#a855f7",
                                            background: "none",
                                            border: "none",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                "" // Hoặc bạn có thể hiển thị text "Đã giao hàng"
                            )}
                        </td>
                    </tr>
                )): <tr><td colSpan="9">Không có dữ liệu</td></tr>}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerOrder;