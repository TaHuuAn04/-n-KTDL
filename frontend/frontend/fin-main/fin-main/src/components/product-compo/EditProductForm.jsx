import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';

const EditProductForm = ({ product, onSave }) => {
    const [form] = Form.useForm();
    const [editedProduct, setEditedProduct] = useState(product);

    useEffect(() => {
        form.setFieldsValue({
            name: editedProduct.name,
            type: editedProduct.type,
            unitPrice: editedProduct.unitPrice,
            quantityInStock: editedProduct.quantityInStock,
            expirationDate: dayjs(editedProduct.expirationDate),
            supplier: editedProduct.supplier,
            note: editedProduct.note,
        });
    }, [editedProduct]);

    const onFinish = (values) => {
        // Convert expirationDate back to string in the required format
        const updatedProduct = {
            ...editedProduct,
            ...values,
            expirationDate: values.expirationDate.format('YYYY-MM-DD'),
        };
        onSave(updatedProduct);
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item
                label="Tên thuốc"
                name="name"
                rules={[{ required: true, message: 'Please input the name of the product!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Loại thuốc"
                name="type"
                rules={[{ required: true, message: 'Please input the type of the product!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Giá"
                name="unitPrice"
                rules={[{ required: true, message: 'Please input the unitPrice of the product!' }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                label="Số lượng"
                name="quantityInStock"
                rules={[{ required: true, message: 'Please input the quantityInStock of the product!' }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                label="Ngày hết hạn"
                name="expirationDate"
                rules={[{ required: true, message: 'Please select the expiry date of the product!' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                label="Nhà cung cấp"
                name="supplier"
                rules={[{ required: true, message: 'Please input the supplier of the product!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Ghi chú"
                name="note"
                rules={[{ required: true, message: 'Please input the type of the product!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lưu
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditProductForm;
