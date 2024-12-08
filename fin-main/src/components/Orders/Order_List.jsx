import React from "react";
import Layout from "../../Layout"; // Giả sử SideBar đã được xây dựng và import

function OrderList() {
    // Dữ liệu mẫu - thay thế bằng API fetch từ server trong thực tế
    const orders = [
        {
            orderId: "DH001",
            customerName: "Nguyễn Văn A",
            orderDate: "01/12/2024",
            status: "Đang xử lý",
        },
        {
            orderId: "DH002",
            customerName: "Trần Thị B",
            orderDate: "02/12/2024",
            status: "Hoàn thành",
        },
        {
            orderId: "DH003",
            customerName: "Lê Văn C",
            orderDate: "03/12/2024",
            status: "Đã hủy",
        },
    ];

    const handleViewDetails = (orderId) => {
        console.log("Viewing details for order:", orderId);
    };

    return (
        <div className="order-list-container" style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Layout />

            {/* Main content */}
            <div
                className="order-list-content"
                style={{
                    flex: 1,
                    padding: "20px",
                    backgroundColor: "#fef8f5",
                    borderRadius: "8px",
                    margin: "20px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h1 style={{ textAlign: "center", color: "#444", marginBottom: "20px" }}>
                    Quản lý đơn hàng
                </h1>

                {/* Order List Table */}
                <div
                    className="order-table"
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Mã đơn hàng</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Tên khách hàng</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Ngày đặt</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Trạng thái</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{order.orderId}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{order.customerName}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{order.orderDate}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{order.status}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
                                    <button
                                        onClick={() => handleViewDetails(order.orderId)}
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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderList;
