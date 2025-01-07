import classNames from 'classNames/bind';
import { Link, useParams } from 'react-router-dom';
import AddDoctorActivity from '../AddEmployeeActivity';
import CustomerInfo from '../CustomerInfo';
import styles from './PatientDetail.module.scss';
// import AddResult from '../AddResult';
import { useState, useEffect } from 'react';
// import Orders from '../Orders';
import axios from 'axios';
import UserInfo from '../../AuthContext';
import { useAuth } from '../../AuthContext';
const cx = classNames.bind(styles);
import ExaminationHistory from '../Orders/Content.jsx';
import React from 'react';



function CustomerDetail() {
    const { id: customerId } = useParams();
    
    const { UserInfo, isAdmin } = useAuth();

    const [customerInfo, setCustomerInfo] = useState({});
    
    //lay thong tin benh nhan (lay duoc toan bo thong tin benh nhan bao gom lich su kham)
    useEffect(() => {
        const fetchCustomerInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/customers/search?keywords=${customerId}`);
                setCustomerInfo(response.data.customer);
                console.log('Customer info:', response.data);
            } catch (error) {
                console.error('Error fetching customer info:', error);
                // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
            }
        };

        fetchCustomerInfo();
    }, [customerId]);

    //goi API lay danh sach lich su kham benh cua benh nhan do



        
    return (
    <div className={cx('wrapper')}>
        <div className={cx('navbar')}>
            <Link to={`/customer-order/${customerId}`} className={cx('schedule-btn')}>
                Đơn hàng
            </Link>
            <Link to="/customer" className={cx('list-btn')}>
                Danh sách khách hàng
            </Link>
        </div>
        {/* Add component */}
        <div className={cx('patient-info')}>
            <p className={cx('title')}> THÔNG TIN KHÁCH HÀNG</p>

            <CustomerInfo
                image={customerInfo.image}
                id = {customerInfo['Cust ID']}
                first_name = {customerInfo['First Name']}
                last_name = {customerInfo['Last Name']}
                company = {customerInfo.Company}
                address = {customerInfo.City}
                phone1 = {customerInfo['Phone 1']}
                phone2 = {customerInfo['Phone 2']}
                country = {customerInfo.Country}
                email = {customerInfo.Email}
                subscription={customerInfo['Subscription Date']}
                generalInfo={customerInfo.generalInfo}

            />
            {/*<div className={cx('history-wrapper')}>*/}
            {/*    <div className={cx('history-header-wrapper')}>*/}
            {/*        <h4 className={cx('history-wrapper-header')}>Lịch sử đơn hàng</h4>*/}
            {/*        <AddDoctorActivity callAPI={createExamination}  />*/}
            {/*    </div>*/}
            {/*    <div className={cx('history-title-wrapper')}>*/}
            {/*        <ul className={cx('history-title-list')}>*/}
            {/*            <li className={cx('history-title-item')}>Ngày</li>*/}
            {/*            <li className={cx('history-title-item')}>Bác sĩ chỉ định</li>*/}
            {/*            <li className={cx('history-title-item')}>Bác sĩ thực hiện</li>*/}
            {/*            <li className={cx('history-title-item')}>Phương pháp</li>*/}
            {/*            <li className={cx('history-title-item')}>Trạng thái</li>*/}
            {/*            <li className={cx('history-title-item')}>Kết quả</li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*    */}
            {/*    <Orders  */}
            {/*        ls = {Examhistory}*/}
            {/*        handleUpdateHistory={updateMedicalHistory}*/}
            {/*    />*/}
            {/*</div>*/}
        </div>
    </div>
    );
}

export default CustomerDetail;
