import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const EditDoctorForm = ({ doctor, onSave }) => {
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, []);

    useEffect(() => {
        if (doctor) {
            form.setFieldsValue({
                First_Name: doctor.First_Name,
                Gender: doctor.Gender,
                ['Start Date']: doctor['Start Date'],
                Email: doctor.Email,
                branch: doctor.branch,
                team: doctor.Team,
            });
        }
    }, [doctor, form]);

    const onFinish = (values) => {
        const updatedDoctor = {
            ...doctor,
            ...values,
            //Start_Date: values.Start_Date ? values.Start_Date.format('YYYY-MM-DD') : doctor.Start_Date,
        };
        onSave(updatedDoctor);
    };

    const isCurrentUser = user && doctor && doctor.id === user.username;

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
                label="Họ tên"
                name="First_Name"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
                <Input readOnly={!isCurrentUser} />
            </Form.Item>

            <Form.Item
                label="Giới tính"
                name="Gender"
                rules={[{ required: true, message: 'Vui lòng nhập giới tính!' }]}
            >
                <Input readOnly={!isCurrentUser} />
            </Form.Item>

            <Form.Item
                label="Ngày bắt đầu làm"
                name="Start Date"
                rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu làm!' }]}
            >
                <Input readOnly/>
            </Form.Item>

            <Form.Item
                label="Email"
                name="Email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                ]}
            >
                <Input readOnly={!isCurrentUser} />
            </Form.Item>

            <Form.Item
                label="Chi nhánh"
                name="branch"
            >
                <Input readOnly />
            </Form.Item>

            <Form.Item
                label="Team"
                name="team"
            >
                <Input readOnly />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lưu
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditDoctorForm;