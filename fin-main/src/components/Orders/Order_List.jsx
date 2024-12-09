import React, { useState } from "react";
import Layout from "../../Layout"; // Giả sử SideBar đã được xây dựng và import

function OrderList() {
    // Dữ liệu mẫu - thay thế bằng API fetch từ server trong thực tế
    const orders = [
        {
            orderId: "DH001",
            customerName: "Nguyễn Văn A",
            orderDate: "01/12/2024",
            status: "Đang xử lý",
            sku: "SKU001",
            quantity: 1,
            shippingCode: "SHIP001",
            total: "1,000,000",
        },
        {
            orderId: "DH002",
            customerName: "Trần Thị B",
            orderDate: "02/12/2024",
            status: "Hoàn thành",
            sku: "SKU002",
            quantity: 2,
            shippingCode: "SHIP002",
            total: "2,000,000",
        },
        {
            orderId: "DH003",
            customerName: "Lê Văn C",
            orderDate: "03/12/2024",
            status: "Đã hủy",
            sku: "SKU003",
            quantity: 3,
            shippingCode: "SHIP003",
            total: "3,000,000",
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Lọc đơn hàng dựa trên tìm kiếm và trạng thái
    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.orderId.includes(searchTerm);
        const matchesStatus = filterStatus ? order.status === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="order-list-container" style={{ display: "flex", height: "80vh", flexDirection: "column" }}>
            <div
                className="order-actions"
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}
            >
                {/* Thanh tìm kiếm */}
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

                {/* Các nút lọc trạng thái */}
                <button
                    onClick={() => setFilterStatus("Đang xử lý")}
                    style={buttonStyle(filterStatus === "Đang xử lý")}
                >
                    Đơn hàng chờ duyệt
                </button>
                <button
                    onClick={() => setFilterStatus("Hoàn thành")}
                    style={buttonStyle(filterStatus === "Hoàn thành")}
                >
                    Đơn hàng chờ lấy
                </button>
                <button
                    onClick={() => setFilterStatus("")}
                    style={buttonStyle(filterStatus === "")}
                >
                    Lịch sử đơn hàng
                </button>
            </div>

            {/* Danh sách đơn hàng */}
            <div
                className="order-list-content"
                // style={{
                //     flex: 1,
                //     padding: "20px",
                //     backgroundColor: "#fef8f5",
                //     borderRadius: "8px",
                //     margin: "20px 0",
                //     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                // }}
            >
                <h1 style={{ textAlign: "center", color: "#444", marginBottom: "20px" }}>
                    Quản lý đơn hàng
                </h1>

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
                        {filteredOrders.map((order, index) => (
                            <tr key={index}>
                                <td style={cellStyle}>{order.orderId}</td>
                                <td style={cellStyle}>{order.sku}</td>
                                <td style={cellStyle}>{order.quantity}</td>
                                <td style={cellStyle}>{order.orderDate}</td>
                                <td style={cellStyle}>{order.status}</td>
                                <td style={cellStyle}>{order.shippingCode}</td>
                                <td style={cellStyle}>{order.total}</td>
                                <td style={cellStyle}>
                                    <button
                                        onClick={() => console.log("Viewing details for", order.orderId)}
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
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleNavigateOrder(customer.id)}
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
