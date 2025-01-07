import styles from './ExaminationHistory.module.scss';
import classNames from 'classNames/bind';
import AddResult from '../AddResult';
const cx = classNames.bind(styles);
import { useState } from 'react';
import { Button, Modal } from 'antd';
import React from 'react';


function ExaminationHistory({ls, handleUpdateHistory}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className={cx('history-body-wrapper')}>
            {ls.map((history, index) => {
                      return (
                          <ul key={index} className={cx('history-body-list')}>
                              <li className={cx('history-body-item--date')}>{history.time}</li>
                              <li className={cx('history-body-item')}>
                                  {history.doctor_appointed_name}
                                  <br />
                                  {history.doctor_appointed_id}
                              </li>
                              <li className={cx('history-body-item')}>
                                  {history.doctor_performed_name}
                                  <br />
                                  {history.doctor_performed_id}
                                  <br />
                              </li>
                              <li className={cx('history-body-item', 'history-body-item--method')}>{history.method}</li>
                              <li className={cx('history-body-item', 'history-body-item--status')}>{history.status}</li>
                              <li className={cx('history-body-item', 'history-body-item--result')}>
                                  {history.status !== 'Hoàn thành' && <AddResult handleUpdateHistory={handleUpdateHistory}/>}
                                  <div>
                                      <Button
                                          type="primary"
                                          onClick={showModal}
                                          style={{ backgroundColor: '#1c7518', marginTop: '4px', minWidth: '115.07px' }}
                                      >
                                          Xem kết quả
                                      </Button>
                                      <Modal
                                          title="Kết quả khám bệnh"
                                          open={isModalOpen}
                                          onOk={handleOk}
                                          onCancel={handleCancel}
                                      >
                                          <p>{history.result}</p>
                                      </Modal>
                                  </div>
                              </li>
                          </ul>
                      );
                  })
                }
        </div>
    );
}

export default ExaminationHistory;
