import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classNames/bind';
import { Link } from 'react-router-dom';
import AddSchedule from '../AddSchedule';
import styles from './PatientSchedule.module.scss';
import React from 'react';

const cx = classNames.bind(styles);

function CustomerOrder(props) {
    return (
        <div className={cx('wrapper')}>

            <div className={cx('navbar')}>

                <Link to="/customer-detail/${props}" className={cx('list-btn')}>
                    Thoát
                </Link>
            </div>
            <p className={cx('title')}>LỊCH SỬ ĐƠN HÀNG</p>
            <p className={cx('title')}>Khách hàng: </p>

            <table className={cx('history-table')}>
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Thời gian tạo</th>
                    <th>Mã SKU sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Mã ship</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Duyệt</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>407-1298130-0368305</td>
                    <td>12/4/2023</td>
                    <td>JNE3797-KR-XXL</td>
                    <td>123</td>
                    <td>416436</td>
                    <td>1.000.000</td>
                    <td>Đã duyệt</td>
                    <td>
                        <button
                            className="edit-btn"
                            onClick={() => handleEdit(employeeData)}
                            style={{
                                fontSize: "16px",
                                color: "#a855f7",
                                background: "none",
                                border: "none",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Duyệt
                        </button>
                        <button
                            className="edit-btn"
                            onClick={() => handleEdit(employeeData)}
                            style={{
                                fontSize: "16px",
                                color: "#a855f7",
                                background: "none",
                                border: "none",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Hủy
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default CustomerOrder;
