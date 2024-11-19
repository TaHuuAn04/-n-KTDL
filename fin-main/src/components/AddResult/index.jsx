import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';

// const cx = classNames.bind(styles)
const { Option } = Select;
const CollectionCreateForm = ({ initialValues, onFormInstanceReady }) => {
    const [selectedFloor, setSelectedFloor] = useState();
    const [optionRoom, setOptionRoom] = useState([]);

    const handleFloorChange = (floor) => {
        setSelectedFloor(floor);
        generateRoom(floor);
    };

    const generateRoom = (floor) => {
        const startRoom = floor * 100 + 1;
        const endRoom = floor * 100 + 10;
        const opt = [];
        for (let i = startRoom; i <= endRoom; i++) {
            opt.push(
                <Option key={i} value={String(i)}>
                    {i}
                </Option>,
            );
        }
        setOptionRoom(opt);
    };

    const [form] = Form.useForm();
    useEffect(() => {
        onFormInstanceReady(form);
    }, []);
    return (
        <Form layout="vertical" form={form} name="form_in_modal">
            <Form.Item
                name="doctor_performed_name"
                label="Mã số bác sĩ thực hiện"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mã số bác sĩ thực hiện!',
                    },
                ]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                name="result description"
                label="Mô tả kết quả"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mô tả kết quả!',
                    },
                ]}
            >
                <Input.TextArea/>
            </Form.Item>
            <Form.Item
                name="conclusion"
                label="Kết luận"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập kết luận!',
                    },
                ]}
            >
                <Input.TextArea/>
            </Form.Item>
            
        </Form>
    );
};
const CollectionCreateFormModal = ({ open, onCreate, onCancel, initialValues}) => {
    const [formInstance, setFormInstance] = useState();
    return (
        <Modal
            open={open}
            title="Thêm mới kết quả"
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{
                autoFocus: true,
            }}
            onCancel={onCancel}
            destroyOnClose
            onOk={async () => {
                try {
                    const values = await formInstance?.validateFields();
                    formInstance?.resetFields();
                    onCreate(values);

                } catch (error) {
                    console.log('Failed:', error);
                }
            }}
        >
            <CollectionCreateForm
                initialValues={initialValues}
                onFormInstanceReady={(instance) => {
                    setFormInstance(instance);
                }}
            />
        </Modal>
    );
};
const AddResult = ({ handleUpdateHistory }) => {
    const [formValues, setFormValues] = useState();
    const [open, setOpen] = useState(false);
    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        setFormValues(values);
        console.log('Updated values of form: ', values);
        setOpen(false);
    };
    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Nhập kết quả
            </Button>
            <CollectionCreateFormModal
                open={open}
                onCreate={onCreate}
                onCancel={() => setOpen(false)}
                initialValues={{
                    modifier: 'public',
                }}
            />
        </>
    );
};
export default AddResult;
