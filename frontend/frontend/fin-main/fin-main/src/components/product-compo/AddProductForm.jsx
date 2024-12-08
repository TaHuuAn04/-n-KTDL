import React, { useState } from 'react';
import { Button, Cascader, DatePicker, Form, Input, InputNumber, Mentions, Select, TreeSelect } from 'antd';
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
            {/* <Form.Item
                label="ID"
                name="id"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <InputNumber
                    // name="id"
                    style={{
                        width: '100%',
                    }}
                />
            </Form.Item> */}

            <Form.Item
                label="Tên sản phẩm"
                name="name"
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
                name={'type'}
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
                name={'unitPrice'}
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

            <Form.Item
                label="Số lượng"
                name={'quantityInStock'}
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <InputNumber
                    // name="quantity"
                    style={{
                        width: '100%',
                    }}
                />
            </Form.Item>

            <Form.Item
                label="Size"
                name={'size'}
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
                name={'supplier'}
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
                label="Ghi chú"
                name={'note'}
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input
                // name="medType"
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
                    Lưu
                </Button>
            </Form.Item>
        </Form>
    );
};
export default AddProductForm;
