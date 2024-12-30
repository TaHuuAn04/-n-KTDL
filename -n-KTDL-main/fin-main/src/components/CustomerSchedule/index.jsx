import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
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

    const handleEdit = (order) => {

    }
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