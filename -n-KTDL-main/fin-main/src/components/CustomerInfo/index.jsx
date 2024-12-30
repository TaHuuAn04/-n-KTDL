import classNames from 'classNames/bind';
import styles from './PatientInfo.module.scss';
import React from 'react';


const cx = classNames.bind(styles);

function CustomerInfo(props) {
    // console.log(patient);
    return (
        <div className={cx('patient-info-wrapper')}>
            <img className={cx('avatar')} src={props.image}></img>
            <div className={cx('body')}>
                <h3 className={cx('body-title')}>Thông tin chung</h3>
                <p className={cx('body-content')}>{props.generalInfo}</p>
                <ul>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>ID:</h4>
                        <p className={cx('list-info-content')}> {props.id}</p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Họ:</h4>
                        <p className={cx('list-info-content')}> {props.name}</p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Tên:</h4>
                        <p className={cx('list-info-content')}> {props.name}</p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Công ty:</h4>
                        <p className={cx('list-info-content')}> {props.birthday} </p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Địa chỉ:</h4>
                        <p className={cx('list-info-content')}> {props.name}</p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Quốc gia:</h4>
                        <p className={cx('list-info-content')}> {props.blood_type} </p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Số điện thoại:</h4>
                        <p className={cx('list-info-content')}> {props.name}, {props.name}</p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Email:</h4>
                        <p className={cx('list-info-content')}>{props.address}</p>
                    </li>
                    <li className={cx('list-info-item')}>
                        <h4 className={cx('list-info-header')}>Ngày đăng kí:</h4>
                        <p className={cx('list-info-content')}>{props.address}</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default CustomerInfo;
