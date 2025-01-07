import React, { useState, useEffect } from 'react';
import { Button, Switch, Form, Input, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';

const EditPatientForm = ({ patient, onSave }) => {
  const [form] = Form.useForm();
  const [editedPatient, setEditedPatient] = useState(patient);

  useEffect(() => {
    form.setFieldsValue({
        name: editedPatient.name,
        birthday: editedPatient.birthday,
        location: editedPatient.location,
        email: editedPatient.email,
        phoneNumber: editedPatient.phoneNumber,
        sex: editedPatient.sex,
        cccd: editedPatient.cccd,
        bloodType: editedPatient.bloodType,
    //   medType: editedMedicine.medType,
    //   price: editedMedicine.price,
    //   quantity: editedMedicine.quantity,
    //   expiryDate: dayjs(editedMedicine.expiryDate),
    //   supplier: editedMedicine.supplier,
    });
  }, [editedPatient]);

  const onFinish = (values) => {
    // Convert expiryDate back to string in the required format
    const updatedPatient = {
      ...editedPatient,
      ...values,
    //   expiryDate: values.expiryDate.format('YYYY-MM-DD'),
    };
    onSave(updatedPatient);
  };

  return (
    <Form form={form} onFinish={onFinish} >
      <Form.Item
        label="Họ tên"
        name="name"
        rules={[{ required: true, message: 'Please input the name of the medicine!' }]}
      >
        <Input readOnly className="read-only-field" />
      </Form.Item>

      <Form.Item
        label="Năm sinh"
        name="birthday"
        rules={[{ required: true, message: 'Please input the price of the medicine!' }]}
      >
        <InputNumber readOnly className="read-only-field" 
        style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="location"
        rules={[{ required: true, message: 'Please input the name of the medicine!' }]}
      >
        <Input readOnly className="read-only-field" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input the name of the medicine!' }]}
      >
        <Input readOnly className="read-only-field" />
      </Form.Item>
      <Form.Item
        label="SĐT"
        name="phoneNumber"
        rules={[{ required: true, message: 'Please input the name of the medicine!' }]}
      >
        <Input readOnly className="read-only-field" />
      </Form.Item>
      <Form.Item
        label="Giới tính"
        name="sex"
        rules={[{ required: true, message: 'Please input the name of the medicine!' }]}
      >
        <Input readOnly className="read-only-field" />
      </Form.Item>
      <Form.Item
        label="Số CCCD"
        name="cccd"
        rules={[{ required: true, message: 'Please input the name of the medicine!' }]}
      >
        <Input readOnly className="read-only-field" />
      </Form.Item>
      <Form.Item
        label="Nhóm máu"
        name="bloodType"
        rules={[{ required: true, message: 'Please input the name of the medicine!' }]}
      >
        <Input />
      </Form.Item>


      {/* <Form.Item
        label="Loại thuốc"
        name="medType"
        rules={[{ required: true, message: 'Please input the type of the medicine!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Giá"
        name="price"
        rules={[{ required: true, message: 'Please input the price of the medicine!' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Số lượng"
        name="quantity"
        rules={[{ required: true, message: 'Please input the quantity of the medicine!' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Ngày hết hạn"
        name="expiryDate"
        rules={[{ required: true, message: 'Please select the expiry date of the medicine!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Nhà cung cấp"
        name="supplier"
        rules={[{ required: true, message: 'Please input the supplier of the medicine!' }]}
      >
        <Input />
      </Form.Item> */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item> 
    </Form>
  );
};

export default EditPatientForm;
