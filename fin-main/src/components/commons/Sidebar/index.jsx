import { Link, useLocation } from 'react-router-dom';
import React from 'react';

function Sidebar() {
    const location = useLocation();

    return (
        
            <ul className="sidebar-list">
                <Link to="/product" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="sidebar-list-item">
                        <div className={location.pathname === '/product' ? 'active' : ''}>Sản phẩm</div>
                    </li>
                </Link>
                <Link to="/employee" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="sidebar-list-item">
                        <div className={location.pathname === '/employee' ? 'active' : ''}>Nhân viên</div>
                    </li>
                </Link>
                <Link to="/customer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="sidebar-list-item">
                        <div className={location.pathname === '/customer' ? 'active' : ''}>Khách hàng</div>
                    </li>
                </Link>
                <Link to="/patient" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="sidebar-list-item">
                        <div className={location.pathname === '/patient' ? 'active' : ''}>Đơn hàng</div>
                    </li>
                </Link>
                <Link to="/medicine" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="sidebar-list-item">
                        <div className={location.pathname === '/medicine' ? 'active' : ''}>Thống kê</div>
                    </li>
                </Link>
            </ul>
        
    );
}

export default Sidebar;
