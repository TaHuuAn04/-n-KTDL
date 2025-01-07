import React from 'react';
import classNames from 'classNames/bind';
import styles from './UserInfo.module.scss';
import { FiLogOut } from 'react-icons/fi';

const cx = classNames.bind(styles);

function UserInfo({ handleLogout }) {
    return (
        <div className={cx('header')}>
            <div className={cx('container')}> {/* Thêm div container */}
                <div className={cx('user-section')}>
                    <div className={cx('avatar')}>
                        <img className={cx('avatar-image')} src="src/assets/avatar.png" alt="Avatar" />
                    </div>
                    <div className={cx('info')}>
                        <h4 className={cx('name')}>Admin</h4>
                        <p className={cx('department')}>Admin</p>
                    </div>
                </div>
                <button className={cx('logout-button')} onClick={handleLogout}>
                    <FiLogOut className={cx('logout-icon')} />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}

export default UserInfo;