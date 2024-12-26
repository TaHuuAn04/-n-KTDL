import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const EditOrderForm = ({ order, onSave, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            'Order ID': order['Order ID'],
            CustID: order.CustID,
            SKU: order.SKU,
            Qty: order.Qty,
            Date: dayjs(order.Date), // Format lại Date
            Status: order.Status,
            'ship-city': order['ship-city'],
            'ship-state': order['ship-state'],
            'ship-postal-code': order['ship-postal-code'],
            'ship-country': order['ship-country'], // Thêm trường ship-country
            Amount: order.Amount,
            // Bỏ các trường không cho chỉnh sửa: Cust ID, Channel, Category, Size, currency, B2B
        });
    }, [order, form]);

    const onFinish = (values) => {
        const updatedOrder = {
            ...order,
            ...values,
            Date: values.Date.format("MM/DD/YYYY"), // Format lại Date sang MM/DD/YYYY
        };
        onSave(updatedOrder);
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item label="Mã đơn hàng" name="Order ID">
                <Input disabled />
            </Form.Item>

            <Form.Item
                label="Mã SKU"
                name="SKU"
                rules={[{ required: true, message: 'Vui lòng nhập mã SKU!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Mã khách hàng"
                name="CustID"
                rules={[{ required: true, message: 'Vui lòng nhập mã SKU!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Số lượng"
                name="Qty"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Ngày đặt hàng"
                name="Date"
                rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng!' }]}
            >
                <DatePicker style={{ width: '100%' }}  />
            </Form.Item>

            <Form.Item
                label="Trạng thái"
                name="Status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
                <Select>
                    <Option value="Pending">Pending</Option>
                    <Option value="Processing">Processing</Option>
                    <Option value="Delivering">Delivering</Option>
                    <Option value="Delivered">Delivered</Option>
                    <Option value="Cancelled">Cancelled</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Thành phố"
                name="ship-city"
                rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Tỉnh/Bang"
                name="ship-state"
                rules={[{ required: true, message: 'Vui lòng nhập tỉnh/bang!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Mã bưu chính"
                name="ship-postal-code"
                rules={[{ required: true, message: 'Vui lòng nhập mã bưu chính!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Quốc gia"
                name="ship-country"
                rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="Tổng tiền" name="Amount">
                <InputNumber min={0} style={{ width: '100%' }} disabled/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: '5px' }}>
                    Lưu
                </Button>
                <Button onClick={onCancel}>Hủy</Button>
            </Form.Item>
        </Form>
    );
};

export default EditOrderForm;