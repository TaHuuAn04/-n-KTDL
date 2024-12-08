import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout"; // Giả sử SideBar đã được xây dựng và import

function InfoEmployee() {
    const { id } = useParams(); // Lấy ID nhân viên từ URL

    // Dữ liệu mẫu - thay thế bằng API fetch từ server trong thực tế
    const employeeData = {
        id: id,
        name: "Nguyễn Văn A",
        gender: "Nữ",
        address: "TPHCM",
        email: ["abcxyz@hcmut.edu.vn", "abcxyz04@hcmut.edu.vn"],
        registrationDate: "20/10/2024",
        phone: "0123456789",
        salaryHistory: [
            { dateUpdated: "12/2/2024",perUpdate:"Nguyễn Văn B",month: "01/2024",numDay:"20" ,amount: "10,000,000 VND" },
            { dateUpdated: "12/3/2024", perUpdate:"Nguyễn Văn B",month: "02/2024",numDay:"29" ,amount: "10,500,000 VND" },
        ],
    };

    return (
        <div className="info-employee-container" style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Layout />

            {/* Main content */}
            <div
                className="employee-info-content"
                style={{
                    flex: 1,
                    padding: "20px",
                    backgroundColor: "#fef8f5",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h1 style={{ textAlign: "center", color: "#444", marginBottom: "20px" }}>
                    Quản lý thông tin nhân viên
                </h1>

                {/* Profile Section */}
                <div
                    className="profile-section"
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "30px",
                        padding: "20px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Avatar */}
                    <div
                        className="avatar"
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            backgroundColor: "#a855f7",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "60px",
                            color: "#fff",
                        }}
                    >
                        👤
                    </div>

                    {/* Employee Details */}
                    <div className="employee-details" style={{ flex: 1 }}>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Họ và tên:</strong> {employeeData.name}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Giới tính:</strong> {employeeData.gender}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Địa chỉ:</strong> {employeeData.address}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Email:</strong>
                            <br />
                            {employeeData.email.map((email, index) => (
                                <span key={index}>{email}<br /></span>
                            ))}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Ngày đăng ký:</strong> {employeeData.registrationDate}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Số điện thoại:</strong> {employeeData.phone}
                        </p>
                    </div>
                </div>

                {/* Salary History Section */}
                <div
                    className="salary-history"
                    style={{
                        marginTop: "30px",
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h3 style={{ marginBottom: "10px", color: "#444" }}>Lịch sử lương</h3>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "10px",
                            textAlign: "left",
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Ngày cập nhật</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Người cập nhật</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Ngày làm việc</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Tháng</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Số tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeeData.salaryHistory.map((entry, index) => (
                            <tr key={index}>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.dateUpdated}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.perUpdate}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.month}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.numDay}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.amount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default InfoEmployee;
