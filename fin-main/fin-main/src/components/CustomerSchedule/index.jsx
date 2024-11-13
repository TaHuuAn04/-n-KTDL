import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classNames/bind';
import { Link } from 'react-router-dom';
import AddSchedule from '../AddSchedule';
import styles from './PatientSchedule.module.scss';
import React from 'react';

const cx = classNames.bind(styles);

function PatientSchedule() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('navbar')}>

                <Link to="/patient-detail" className={cx('list-btn')}>
                    Thoát
                </Link>
            </div>
            <div className={cx('patient-info')}>
                <p className={cx('title')}>Kế hoạch điều trị</p>
                <div className={cx('patient-info-wrapper')}>
                    <img className={cx('avatar')} src="src/assets/patient-avt.png"></img>
                    <div className={cx('body')}>
                        <h3 className={cx('body-title')}>Thông tin chung</h3>
                        <p className={cx('body-content')}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book.
                        </p>
                        <ul className={cx('list-info')}>
                            <li className={cx('list-info-item')}>
                                <h4 className={cx('list-info-header')}>Họ và tên</h4>
                                <p className={cx('list-info-content')}> Nguyễn Văn A </p>
                            </li>
                            <li className={cx('list-info-item')}>
                                <h4 className={cx('list-info-header')}>Ngày sinh</h4>
                                <p className={cx('list-info-content')}> 12-04-1994 </p>
                            </li>
                            <li className={cx('list-info-item')}>
                                <h4 className={cx('list-info-header')}>Nhóm máu</h4>
                                <p className={cx('list-info-content')}> AB </p>
                            </li>
                            <li className={cx('list-info-item')}>
                                <h4 className={cx('list-info-header')}>Địa chỉ</h4>
                                <p className={cx('list-info-content')}>26 Tô Ngọc Vân, Linh Trung, Thủ Đức, TPHCM</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={cx('history-wrapper')}>
                    <div className={cx('history-header-wrapper')}>
                        <h4 className={cx('history-wrapper-header')}>Kế hoạch chi tiết</h4>
                        <AddSchedule />
                    </div>
                    <div className={cx('history-title-wrapper')}>
                        <ul className={cx('history-title-list')}>
                            <li className={cx('history-title-item')}>Thời gian tạo</li>
                            <li className={cx('history-title-item')}>Bác sĩ lên kế hoạch</li>
                            <li className={cx('history-title-item')}>Nội dung</li>
                            <li className={cx('history-title-item')}>Ngày dự kiến thực hiện</li>
                            <li className={cx('history-title-item')}>Chỉnh sửa</li>
                        </ul>
                    </div>

                    <div className={cx('history-body-wrapper')}>
                        <ul className={cx('history-body-list')}>
                            <li className={cx('history-body-item--date')}>12:09:12 22-02-2024</li>
                            <li className={cx('history-body-item')}>
                                Trương Văn Nghĩa <br />
                                BSNTH030821
                            </li>
                            <li className={cx('history-body-item', 'history-body-item--content')}>
                                Chờ kết quả chụp X quang rồi các bác sĩ sẽ hội chẩn xem có cần phẩu thuật không
                            </li>
                            <li className={cx('history-body-item--date')}>29-02-2024</li>
                            <li className={cx('history-body-item', 'history-body-item--edit')}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </li>
                        </ul>
                        <ul className={cx('history-body-list')}>
                            <li className={cx('history-body-item--date')}>12:09:12 22-02-2024</li>
                            <li className={cx('history-body-item')}>
                                Trương Văn Nghĩa <br />
                                BSNTH030821
                            </li>
                            <li className={cx('history-body-item', 'history-body-item--content')}>
                                Chờ kết quả chụp X quang rồi các bác sĩ sẽ hội chẩn xem có cần phẩu thuật không
                            </li>
                            <li className={cx('history-body-item--date')}>29-02-2024</li>
                            <li className={cx('history-body-item', 'history-body-item--edit')}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </li>
                        </ul>
                        <ul className={cx('history-body-list')}>
                            <li className={cx('history-body-item--date')}>12:09:12 22-02-2024</li>
                            <li className={cx('history-body-item')}>
                                Trương Văn Nghĩa <br />
                                BSNTH030821
                            </li>
                            <li className={cx('history-body-item', 'history-body-item--content')}>
                                Chờ kết quả chụp X quang rồi các bác sĩ sẽ hội chẩn xem có cần phẩu thuật không
                            </li>
                            <li className={cx('history-body-item--date')}>29-02-2024</li>
                            <li className={cx('history-body-item', 'history-body-item--edit')}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </li>
                        </ul>
                        <ul className={cx('history-body-list')}>
                            <li className={cx('history-body-item--date')}>12:09:12 22-02-2024</li>
                            <li className={cx('history-body-item')}>
                                Trương Văn Nghĩa <br />
                                BSNTH030821
                            </li>
                            <li className={cx('history-body-item', 'history-body-item--content')}>
                                Chờ kết quả chụp X quang rồi các bác sĩ sẽ hội chẩn xem có cần phẩu thuật không
                            </li>
                            <li className={cx('history-body-item--date')}>29-02-2024</li>
                            <li className={cx('history-body-item', 'history-body-item--edit')}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </li>
                        </ul>
                        <ul className={cx('history-body-list')}>
                            <li className={cx('history-body-item--date')}>12:09:12 22-02-2024</li>
                            <li className={cx('history-body-item')}>
                                Trương Văn Nghĩa <br />
                                BSNTH030821
                            </li>
                            <li className={cx('history-body-item', 'history-body-item--content')}>
                                Chờ kết quả chụp X quang rồi các bác sĩ sẽ hội chẩn xem có cần phẩu thuật không
                            </li>
                            <li className={cx('history-body-item--date')}>29-02-2024</li>
                            <li className={cx('history-body-item', 'history-body-item--edit')}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientSchedule;
