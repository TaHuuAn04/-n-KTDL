import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrderList() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState(""); // "", "Pending", "Processing", "Delivering", "Delivered", "Cancelled"
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found!");
                return;
            }

            let url = "http://localhost:3000/sales/filter";
            const params = {};

            if (filterStatus) {
                params.status = filterStatus;
            }

            if (searchTerm) {
                params.orderId = searchTerm;
            }

            params.sortBy = "date_desc";
            console.log('params:', params);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params,
            });

            if (Array.isArray(response.data.sale)) {
                setOrders(response.data.sale);
            } else {
                console.error("Expected an array but received:", response.data.sale);
                setOrders([]);
            }
        } catch (err) {
            setError(err.message || "An error occurred while fetching orders.");
        } finally {
            setIsLoading(false);
        }
    };

    // Lọc đơn hàng dựa trên tìm kiếm (nếu cần)
    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order["Order ID"].toLowerCase().includes(searchTerm.toLowerCase());
        // const matchesStatus = filterStatus ? order.status === filterStatus : true;
        return matchesSearch;
    });

    const handleOrderStatusChange = (newStatus) => {
        setFilterStatus(newStatus);
    };

    const handleViewDetails = (orderId) => {
        navigate(`/order-details/${orderId}`);
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
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order["Order ID"]}>
                                    <td style={cellStyle}>{order["Order ID"]}</td>
                                    <td style={cellStyle}>{order.SKU}</td>
                                    <td style={cellStyle}>{order.Qty}</td>
                                    <td style={cellStyle}>{new Date(order.Date).toLocaleDateString("vi-VN")}</td>
                                    <td style={cellStyle}>{order.Status}</td>
                                    <td style={cellStyle}>{order["Ship Postal Code"]}</td>
                                    <td style={cellStyle}>{order.Amount}</td>
                                    <td style={cellStyle}>
                                        <button
                                            onClick={() => handleViewDetails(order["Order ID"])}
                                            style={{
                                                padding: "5px 10px",
                                                backgroundColor: "#a855f7",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Xem chi tiết
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
                </div>
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