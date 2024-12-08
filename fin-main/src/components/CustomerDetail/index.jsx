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
    const { customerId } = useParams();
    
    const { UserInfo, isAdmin } = useAuth();

    const [customerInfo, setCustomerInfo] = useState({});
    const [Examhistory, setExamHistory] = useState([])
    
    //lay thong tin benh nhan (lay duoc toan bo thong tin benh nhan bao gom lich su kham)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:3000/patients");
            setCustomerInfo(response.data);
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();
      }, [customerId]
    );

    //goi API lay danh sach lich su kham benh cua benh nhan do

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:3000/examination_history");
            setExamHistory(response.data);
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();
      }, [Examhistory]
    );




    //ham cap nhat lich su kham
    const updateMedicalHistory = async (historyId, updatedData) => {
        try {
          const response = await axios.patch(`/patients/${customerId}/medical-history/${historyId}`, updatedData);
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
    };


    const createExamination = (newExam) => {
        axios
            .post('http://localhost:3000/examination_history', newExam)
            .then((response) => setExamHistory([...Examhistory, response.data]))
            .catch((error) => console.log(error));
    };
        
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
                generalInfo={customerInfo.generalInfo}
                name={customerInfo.name}
                birthday={customerInfo.birthday}
                blood_type={customerInfo.blood_type}
                address={customerInfo.address}
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
