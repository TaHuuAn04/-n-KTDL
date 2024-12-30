import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import EditOrderForm from './EditOrderForm';
import SimplePagination from '../product-compo/Button_Page.jsx';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
function OrderList() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8; // Số đơn hàng trên mỗi trang
    const [fromDate, setFromDate] = useState(null); // Thêm state fromDate
    const [toDate, setToDate] = useState(null);     // Thêm state toDate
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const showEditModal = () => {
        setIsEditModalVisible(true);
    };

    const handleEditOk = () => {
        setIsEditModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setIsEditModalVisible(true);
    };

    const handleSave = async (editedOrder) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found!');
                return;
            }

            const response = await axios.patch(
                `http://localhost:3000/sales/update/${editedOrder['Order ID']}`,
                editedOrder,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );



            const updatedOrders = orders.map((o) =>
                o['Order ID'] === editedOrder['Order ID'] ? response.data.order : o
            );
            setOrders(updatedOrders);
            console.log('order', orders);
            setIsEditModalVisible(false);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    useEffect(() => {
        const fetchOrderCounts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found!");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const params = {
                    orderId: searchTerm
                };

                // Gọi API để lấy tổng số đơn hàng cho mỗi trạng thái
                const allCountResponse = await axios.get("http://localhost:3000/sales/count", {
                    headers
                });

                const pendingCountResponse = await axios.get("http://localhost:3000/sales/count", {
                    headers,
                    params: { status: "Pending", orderId: searchTerm },
                });

                const processingCountResponse = await axios.get("http://localhost:3000/sales/count", {
                    headers,
                    params: { status: "Processing", orderId: searchTerm },
                });

                const deliveringCountResponse = await axios.get("http://localhost:3000/sales/count", {
                    headers,
                    params: { status: "Delivering", orderId: searchTerm },
                });

                const deliveredCountResponse = await axios.get("http://localhost:3000/sales/count", {
                    headers,
                    params: { status: "Delivered", orderId: searchTerm },
                });

                const cancelledCountResponse = await axios.get("http://localhost:3000/sales/count", {
                    headers,
                    params: { status: "Cancelled", orderId: searchTerm },
                });
                const totalAll = allCountResponse.data.totalOrders;
                const totalPending = pendingCountResponse.data.totalOrders;
                const totalProcessing = processingCountResponse.data.totalOrders;
                const totalDelivering = deliveringCountResponse.data.totalOrders;
                const totalDelivered = deliveredCountResponse.data.totalOrders;
                const totalCancelled = cancelledCountResponse.data.totalOrders;

                let totalOrders;
                switch (filterStatus) {
                    case "Pending":
                        totalOrders = totalPending;
                        break;
                    case "Processing":
                        totalOrders = totalProcessing;
                        break;
                    case "Delivering":
                        totalOrders = totalDelivering;
                        break;
                    case "Delivered":
                        totalOrders = totalDelivered;
                        break;
                    case "Cancelled":
                        totalOrders = totalCancelled;
                        break;
                    default:
                        totalOrders = totalAll;
                }
                setTotalPages(Math.ceil(totalOrders / itemsPerPage));

            } catch (error) {
                console.error("Error fetching order counts:", error)
            }
        };

        fetchOrderCounts();
        fetchOrders();
    }, [filterStatus, currentPage, searchTerm, fromDate, toDate]);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found!');
                return;
            }

            const params = {
                page: currentPage,
                limit: itemsPerPage,
            };

            if (filterStatus) {
                params.status = filterStatus;
            }
            if (fromDate) {
                params.fromDate = dayjs(fromDate).format('YYYY-MM-DD');
            }
            if (toDate) {
                params.toDate = dayjs(toDate).format('YYYY-MM-DD');
            }
            if (searchTerm) {
                params.orderId = searchTerm;
            }
            console.log("Params: ", params);
            const response = await axios.get('http://localhost:3000/sales/filter', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            console.log('Fetch orders response:', response.data.sale);
            if (Array.isArray(response.data.sale)) {
                setOrders(response.data.sale);
            } else {
                console.error('Expected an array but received:', response.data.sale);
                setOrders([]);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching orders.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setFromDate(dates[0]);
            setToDate(dates[1]);
        } else {
            setFromDate(null);
            setToDate(null);
        }
        setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
    };
    const handleOrderStatusChange = (newStatus) => {
        setFilterStatus(newStatus);
        setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
    };

    const handleApprove = async (order) => {
        try {
            const token = localStorage.getItem('token');
            const orderID = order['Order ID'];

            if (!token) {
                console.error("No token found!");
                return;
            }

            const response = await axios.patch(
                `http://localhost:3000/sales/changeStatus/${orderID}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Update status response:', response.data);

            // Cập nhật trạng thái đơn hàng trong danh sách orders
            const updatedOrders = orders.map((o) =>
                o['Order ID'] === orderID ? { ...o, Status: response.data.order.Status } : o
            );
            setOrders(updatedOrders);
            console.log('Updated orders:', updatedOrders);

        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }

    const handleCancel = async (order) => {
        try {
            const token = localStorage.getItem('token');
            const orderID = order['Order ID'];

            if (!token) {
                console.error("No token found!");
                return;
            }

            const response = await axios.patch(
                `http://localhost:3000/sales/cancelSale/${orderID}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Cancel order response:', response.data);

            // Cập nhật trạng thái đơn hàng trong danh sách orders
            const updatedOrders = orders.map((o) =>
                o['Order ID'] === orderID ? { ...o, Status: 'Cancelled' } : o
            );
            setOrders(updatedOrders);

        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    return (
        <div className="order-list-container" style={{ display: "flex", height: "80vh", flexDirection: "column" }}>
            <div
                className="order-actions"
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}
            >
                <input
                    type="text"
                    placeholder="Tìm mã đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        flex: 1,
                        marginRight: "20px",
                    }}
                />
                <RangePicker
                    onChange={handleDateRangeChange}
                    value={[fromDate, toDate]}
                    style={{ marginRight: '20px' }}
                />
                <button onClick={() => handleOrderStatusChange("")} style={buttonStyle(filterStatus === "")}>
                    Tất cả
                </button>
                <button
                    onClick={() => handleOrderStatusChange("Pending")}
                    style={buttonStyle(filterStatus === "Pending")}
                >
                    Đơn hàng chờ duyệt
                </button>
                <button
                    onClick={() => handleOrderStatusChange("Processing")}
                    style={buttonStyle(filterStatus === "Processing")}
                >
                    Đơn hàng chờ lấy
                </button>
                <button
                    onClick={() => handleOrderStatusChange("Delivering")}
                    style={buttonStyle(filterStatus === "Delivering")}
                >
                    Đơn hàng đang giao
                </button>
                <button
                    onClick={() => handleOrderStatusChange("Delivered")}
                    style={buttonStyle(filterStatus === "Delivered")}
                >
                    Đơn hàng đã giao
                </button>
                <button onClick={() => handleOrderStatusChange("Cancelled")} style={buttonStyle(filterStatus === "Cancelled")}>
                    Lịch sử trả hàng
                </button>
            </div>

            <div className="order-list-content">
                <h1 style={{ textAlign: "center", color: "#444", marginBottom: "20px" }}>Quản lý đơn hàng</h1>

                <div
                    className="order-table"
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                        <tr>
                            <th style={headerStyle}>Mã đơn hàng</th>
                            <th style={headerStyle}>Mã SKU sản phẩm</th>
                            <th style={headerStyle}>Số lượng</th>
                            <th style={headerStyle}>Ngày đặt</th>
                            <th style={headerStyle}>Trạng thái</th>
                            <th style={headerStyle}>Mã ship</th>
                            <th style={headerStyle}>Tổng tiền</th>
                            <th style={headerStyle}>Hành động</th>
                            <th style={headerStyle}>Duyệt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "red" }}>
                                    {error}
                                </td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order["Order ID"]}>
                                    <td style={cellStyle}>{order['Order ID']}</td>
                                    <td style={cellStyle}>{order.SKU}</td>
                                    <td style={cellStyle}>{order.Qty}</td>
                                    <td style={cellStyle}>{order.Date}</td>
                                    <td style={cellStyle}>{order.Status}</td>
                                    <td style={cellStyle}>{order["ship-postal-code"]}</td>
                                    <td style={cellStyle}>{order.Amount}</td>
                                    <td style={cellStyle}>
                                        <button
                                            onClick={() => handleEdit(order)}
                                            style={{
                                                padding: "5px 10px",
                                                backgroundColor: "#a855f7",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                    <td style={cellStyle}>
                                        {order.Status !== "Delivered" && (
                                            <>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleApprove(order)}
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
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                                    Không có đơn hàng nào.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <Modal
                        title="Chỉnh sửa đơn hàng"
                        open={isEditModalVisible}
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                        footer={null} // Tùy chỉnh footer nếu cần
                    >
                        {selectedOrder && (
                            <EditOrderForm
                                order={selectedOrder}
                                onSave={handleSave}
                                onCancel={handleEditCancel}
                            />
                        )}
                    </Modal>
                </div>
            </div>
            <div className="pagination-container" style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                <SimplePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

// Styles cho header và cell
const headerStyle = {
    borderBottom: "2px solid #ccc",
    padding: "8px",
};

const cellStyle = {
    borderBottom: "1px solid #eee",
    padding: "8px",
};

// Styles cho button
const buttonStyle = (isActive) => ({
    padding: "10px 20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: isActive ? "#a855f7" : "#fff",
    color: isActive ? "#fff" : "#000",
    cursor: "pointer",
    marginLeft: "10px",
});

export default OrderList;