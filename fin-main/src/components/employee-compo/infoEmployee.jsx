import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import axios from "axios";

function InfoEmployee() {
    const { id } = useParams(); // Lấy ID nhân viên từ URL
    const [employeeData, setEmployeeData] = useState(null);
    const [salaryHistory, setSalaryHistory] = useState([]); // Thêm state cho salaryHistory
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoading(true);
                // Lấy thông tin nhân viên
                const infoResponse = await axios.get(`http://localhost:3000/employee/Information/${id}`);
                setEmployeeData(infoResponse.data.employee);

                // Lấy lịch sử lương
                const salaryResponse = await axios.get(`http://localhost:3000/employee/SalaryHistory/${id}`);
                setSalaryHistory(salaryResponse.data.Salary_History);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || "Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!employeeData) {
        return <div>Employee not found.</div>;
    }

    return (
        <div className="info-employee-container" style={{ display: "flex", height: "100vh" }}>
            <Layout />

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

                    <div className="employee-details" style={{ flex: 1 }}>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Họ và tên:</strong> {employeeData.First_Name}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Giới tính:</strong> {employeeData.Gender}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Bộ phận:</strong> {employeeData.branch}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Team:</strong> {employeeData.Team}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Email:</strong>
                            <br />
                            {employeeData.Email}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Ngày vào
                                làm:</strong> {new Date(employeeData.Start_Date).toLocaleDateString("vi-VN")}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Bonus Lương:</strong> {employeeData.Bonus}
                        </p>
                    </div>
                </div>

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
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Team</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Số ngày làm việc</th>
                            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Tổng lương</th>
                        </tr>
                        </thead>
                        <tbody>
                        {salaryHistory.map((entry, index) => (
                            <tr key={index}>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
                                    {new Date(entry.Date_Update).toLocaleDateString("vi-VN")}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.Updated_By}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.Team}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{entry.Number_of_WDs}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
                                    {entry.Total_Salary.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
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

export default InfoEmployee;