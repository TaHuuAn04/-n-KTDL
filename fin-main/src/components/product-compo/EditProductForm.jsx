import React, { useState, useEffect } from 'react';
import {Button, Form, Input, InputNumber, DatePicker, Space} from 'antd';
import dayjs from 'dayjs';

const EditProductForm = ({ product, onSave }) => {
    const [form] = Form.useForm();
    const [editedProduct, setEditedProduct] = useState(product);

    useEffect(() => {
        form.setFieldsValue({
            _id: editedProduct._id,
            ['SKU Code']: editedProduct['SKU Code'],
            Name: editedProduct.Name,
            ['Design No']: editedProduct['Design No '],
            Category: editedProduct.Category,
            Price: editedProduct.Price,
            ['stock in B1']: editedProduct['stock in B1'],
            ['stock in B2']: editedProduct['stock in B2'],
            ['stock in B3']: editedProduct['stock in B3'],
            ['stock in B4']: editedProduct['stock in B4'],
            Size: editedProduct.Size,
            Supplier: editedProduct.Supplier,
            Color: editedProduct.Color,
        });
    }, [editedProduct]);

    const onFinish = (values) => {
        // Convert expirationDate back to string in the required format
        const updatedProduct = {
            ...editedProduct,
            ...values,
        };
        onSave(updatedProduct);
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item label="ID" name="_id">
                <Input disabled value={editedProduct._id} />
            </Form.Item>


            <Form.Item
                label="SKU Code"
                name="SKU Code"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input
                />
            </Form.Item>

            <Form.Item
                label="Tên sản phẩm"
                name="Name"
                rules={[{ required: true, message: 'Please input the name of the product!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Mã thiết kế"
                name="Design No"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input
                    // name="name"
                />
            </Form.Item>

            <Form.Item
                label="Loại"
                name="Category"
                rules={[{ required: true, message: 'Please input the type of the product!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Giá"
                name="Price"
                rules={[{ required: true, message: 'Please input the Price of the product!' }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Số lượng">
                <Space>
                    <Form.Item name="stock in B1" rules={[{ required: true, message: 'Vui lòng nhập số lượng B1!' }]}>
                        <InputNumber placeholder="B1" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="stock in B2" rules={[{ required: true, message: 'Vui lòng nhập số lượng B2!' }]}>
                        <InputNumber placeholder="B2" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="stock in B3" rules={[{ required: true, message: 'Vui lòng nhập số lượng B3!' }]}>
                        <InputNumber placeholder="B3" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="stock in B4" rules={[{ required: true, message: 'Vui lòng nhập số lượng B4!' }]}>
                        <InputNumber placeholder="B4" style={{ width: '100%' }} />
                    </Form.Item>
                </Space>
            </Form.Item>

            <Form.Item
                label="Size"
                name={'Size'}
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input
                />
            </Form.Item>

            <Form.Item
                label="Nhà cung cấp"
                name="Supplier"
                rules={[{ required: true, message: 'Please input the supplier of the product!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Màu"
                name="Color"
                rules={[{ required: true, message: 'Please input the color of the product!' }]}
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
