import React, { Children } from 'react';
import styles from './Layout.module.scss';
import classNames from 'classNames/bind';
import UserInfo from '../components/commons/UserInfo';
import Logo from '../components/commons/Logo';
import Sidebar from '../components/commons/Sidebar';
const cx = classNames.bind(styles);

function Layout({ children }) {
    return (
        <div className={cx('layout-wrapper')}>
            <div className={cx('blue-background')}></div>
            <div className={cx('layout-header')}>
                <Logo/>
                <UserInfo/>
            </div>
            <div className={cx('layout-body')}>
                <Sidebar/>
                <div className={cx('children')}>{children}</div>
            </div>
        </div>
    );
}


export default Layout;
