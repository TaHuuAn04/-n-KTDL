import React from 'react'
import classNames from 'classNames/bind'
import styles from './UserInfo.module.scss'


const cx = classNames.bind(styles)

function UserInfo() {
  return (
    <div className={cx('header')}>
        <div className={cx('avatar')}>
            <img className={cx('avatar-image')} src="src/assets/avatar.png" alt='Avatar' />  
        </div>
        <div className={cx('info')}>
            <h4 className={cx('name')} >Nguyễn Quốc A</h4>
            <p className={cx('department')} >Khoa Ngoại Tổng Hợp</p>
        </div>
    </div>
  )
}

export default UserInfo