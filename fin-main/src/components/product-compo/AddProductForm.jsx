import React, { useState } from 'react';
import { Button, Cascader, DatePicker, Form, Input, InputNumber, Mentions, Select, TreeSelect, Space } from 'antd';
import './ProductList.jsx'
const { RangePicker } = DatePicker;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};

const AddProductForm = ({ onAddProduct }) => {
    const [form] = Form.useForm();
    // const newname = Form.useWatch("id", form);
    // console.log(newname);

    const onFinish = (values) => {
        console.log(values);
        onAddProduct(values);
        form.resetFields();
    };

    // const onFinish = (values) => {
    //       console.log(values);
    // }
    return (
        <Form
            {...formItemLayout}
            variant="filled"
            style={{
                maxWidth: 600,
            }}
            form={form}
            onFinish={onFinish}
        >

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
                label="Mã thiết kế"
                name="Design No "
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
                name={'Category'}
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
                label="Màu"
                name={'Color'}
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
                label="Giá"
                name={'Price'}
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <InputNumber
                    // name="price"
                    style={{
                        width: '100%',
                    }}
                />
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
                name={'Supplier'}
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input
                // name="supplier"
                />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 6,
                    span: 16,
                }}
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    // onFinish={onFinish}
                    // onClick={() => form.resetFields({})}
                >
                    <div>Lưu</div>
                </Button>
            </Form.Item>
        </Form>
    );
};
export default AddProductForm;
