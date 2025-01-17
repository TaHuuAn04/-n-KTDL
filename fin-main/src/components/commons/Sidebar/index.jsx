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
                <Link to="/order" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="sidebar-list-item">
                        <div className={location.pathname === '/order' ? 'active' : ''}>Đơn hàng</div>
                    </li>
                </Link>
                <Link to="/summary" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="sidebar-list-item">
                        <div className={location.pathname === '/summary' ? 'active' : ''}>Thống kê</div>
                    </li>
                </Link>
            </ul>
        
    );
}

export default Sidebar;
