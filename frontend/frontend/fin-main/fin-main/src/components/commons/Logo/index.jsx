import classNames from 'classNames/bind';
import React from 'react';

import styles from './Logo.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Logo() {
    return (
        <Link className={cx("logo-container")} to="/dashboard">
            <div className={cx('logo-wrapper')}>
                <span className="UnifrakturCook Bold">Closet</span>
            </div>
        </Link>
    );
}

export default Logo;
