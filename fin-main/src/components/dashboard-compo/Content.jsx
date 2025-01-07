import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import {
    // BsFillArchiveFill,
    // BsFillGrid3X3GapFill,
    // BsPeopleFill,
    // BsFillBellFill,
} from 'react-icons/bs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Area,
    // LineChart,
    // Line,
} from 'recharts';
import axios from 'axios';

function Content() {
    const [revenueData, setRevenueData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [employeeStats, setEmployeeStats] = useState({
        total: 0,
        branches: [],
    });
    const [customerCount, setCustomerCount] = useState(0);
    const [productStats, setProductStats] = useState({
        totalStock: 0,
        totalSold: 0,
    });
    const years = [
        { value: 2023, label: '2023' },
        { value: 2024, label: '2024' },
    ];

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };
    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch revenue data
        const fetchRevenueData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/sales/monthly-revenue', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        year: selectedYear, // Truyền selectedYear vào params
                    },
                });
                setRevenueData(response.data);
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            }
        };

        // Fetch employee statistics
        const fetchEmployeeStats = async () => {
            try {
                // Replace with your actual API endpoint for employee statistics
                const response = await axios.get('http://localhost:3000/employee/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Assuming the response data is an object with { total, branches: [{ name, count }] }
                setEmployeeStats(response.data);
            } catch (error) {
                console.error('Error fetching employee stats:', error);
            }
        };

        // Fetch customer count
        const fetchCustomerCount = async () => {
            try {
                // Replace with your actual API endpoint for customer count
                const response = await axios.get('http://localhost:3000/customers/customerCount', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Assuming the response data is an object with { count }
                setCustomerCount(response.data.count);
            } catch (error) {
                console.error('Error fetching customer count:', error);
            }
        };

        // Fetch product statistics
        const fetchProductStats = async () => {
            try {
                // Replace with your actual API endpoint for product statistics
                const response = await axios.get('http://localhost:3000/products/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Assuming the response data is an object with { total, sold }
                console.log('Product stats:', response.data);
                setProductStats(response.data);
            } catch (error) {
                console.error('Error fetching product stats:', error);
            }
        };

        fetchRevenueData();
        fetchEmployeeStats();
        fetchCustomerCount();
        fetchProductStats();
    }, [selectedYear]);
    // Hàm format số
    const formatNumber = (value) => {
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'k'; // Chia cho 1000 và thêm 'k'
        }
        return value.toString();
    };

    return (
        <div className="content-wrapper" style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '100vh', // Set height to 100% of viewport height
            overflowY: 'auto', // Allow vertical scrolling
            backgroundColor: '#f8f9fa',
        }}>

            <div className="revenue-chart" style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>

                <h2 style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <span>Doanh thu theo tháng</span>
                    <Select
                        style={{width: 120}}
                        placeholder="Chọn năm"
                        onChange={handleYearChange}
                        value={selectedYear}
                    >
                        {years.map((year) => (
                            <Option key={year.value} value={year.value}>
                                {year.label}
                            </Option>
                        ))}
                    </Select>

                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="month" label={{value: 'Tháng', position: 'insideBottom', offset: -5}}/>
                        <YAxis
                            label={{ value: 'Doanh thu', angle: -90, position: 'insideLeft' }}
                            tickFormatter={formatNumber} // Sử dụng hàm formatNumber cho tick
                        />
                        <Tooltip/>
                        <Legend/>
                        <Area type="monotone" dataKey="revenue" fill="#8884d8" stroke="#8884d8"/>
                        <Bar dataKey="revenue" barSize={20} fill="#413ea0"/>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="stats-wrapper" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
            }}>
                <div className="employee-stats" style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{marginBottom: '10px'}}>Thống kê nhân viên</h2>
                    <p>Tổng số nhân viên: {employeeStats.total}</p>
                    {employeeStats.branches.map((branch) => (
                        <p key={branch.name}>
                            Chi nhánh {branch.name}: {branch.count}
                        </p>
                    ))}
                </div>
                <div className="customer-stats" style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{marginBottom: '10px'}}>Thống kê khách hàng</h2>
                    <p>Tổng số khách hàng: {customerCount}</p>
                </div>
                <div className="product-stats" style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{marginBottom: '10px'}}>Thống kê sản phẩm</h2>
                    <p>Tổng số sản phẩm: {productStats.totalStock}</p>
                    <p>Đã bán: {productStats.totalSold}</p>
                </div>
            </div>

        </div>
    );
}

export default Content;