import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import { jwtDecode } from 'jwt-decode';
const { Option } = Select;

const AddDoctorForm = ({ onAddDoctor }) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      if (decoded.manage) {
        // Manager: set default values and readOnly for team and branch
        form.setFieldsValue({
          branch: decoded.branch,
          Team: decoded.Team,
        });
      }
    }
  }, [form]);

  const onFinish = (values) => {
    values.User_Code = values.email;
    onAddDoctor(values);
    form.resetFields();
  };

  return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
            label="Họ tên"
            name="First_Name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
            label="Giới tính"
            name="Gender"
            rules={[{ required: true, message: 'Vui lòng nhập giới tính!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
            label="Ngày sinh"
            name="Date_Of_Birth"
            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
            label="Ngày bắt đầu làm"
            name="Start_Date"
            rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu làm việc!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
            label="Email"
            name="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
            label="Chi nhánh"
            name="branch"
            rules={[{ required: true, message: 'Vui lòng chọn chi nhánh!' }]}
        >
          <Select disabled={user && user.manage && user.role !== 'admin'}>
            <Option value="1">Chi nhánh 1</Option>
            <Option value="2">Chi nhánh 2</Option>
            <Option value="3">Chi nhánh 3</Option>
            <Option value="4">Chi nhánh 4</Option>
          </Select>
        </Form.Item>

        <Form.Item
            label="Team"
            name="Team"
            rules={[{ required: true, message: 'Vui lòng chọn team!' }]}
        >
          <Select disabled={user && user.manage && user.role !== 'admin'}>
            <Option value="Client Services">Client Services</Option>
            <Option value="Distribution">Distribution</Option>
            <Option value="Engineering">Engineering</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Human Resources">Human Resources</Option>
            <Option value="Legal">Legal</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Product">Product</Option>
            <Option value="Sales">Sales</Option>
          </Select>
        </Form.Item>

        {/* Ẩn các trường không cần thiết */}
        {/* ... */}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>
  );
};

export default AddDoctorForm;