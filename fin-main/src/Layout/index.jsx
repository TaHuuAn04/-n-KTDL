import React, { Children, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Nếu bạn dùng react-router-dom để chuyển hướng
import styles from './Layout.module.scss';
import classNames from 'classNames/bind';
import UserInfo from '../components/commons/UserInfo';
import Logo from '../components/commons/Logo';
import Sidebar from '../components/commons/Sidebar';
const cx = classNames.bind(styles);


function Layout({ children }) {
    const [loggedIn, setLoggedIn] = useState(false); // Hoặc lấy từ context, localStorage, ...
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa token khỏi localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        setLoggedIn(false); // Cập nhật state loggedIn
        // Hoặc dispatch action để cập nhật state trong context, redux, ...

        navigate('/'); // Chuyển hướng về trang login (nếu cần)
    };
    return (
        <div className={cx('layout-wrapper')}>
            <div className={cx('blue-background')}></div>
            <div className={cx('layout-header')}>
                <Logo/>
                <UserInfo handleLogout={handleLogout}/>
            </div>
            <div className={cx('layout-body')}>
                <Sidebar/>
                <div className={cx('children')}>{children}</div>
            </div>
        </div>
    );
}


export default Layout;
