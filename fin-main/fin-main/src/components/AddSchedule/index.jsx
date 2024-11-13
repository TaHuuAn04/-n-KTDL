import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
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
                name="room"
                label="Nội dung kế hoạch"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập nội dung kế hoạch!',
                    },
                ]}
            >
                <Input.TextArea/>
            </Form.Item>
            <Form.Item
                name="date"
                label="Ngày dự kiến thực hiện"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn ngày dự kiến thực hiện!',
                    },
                ]}
            >
                <DatePicker/>
            </Form.Item>
            
        </Form>
    );
};
const CollectionCreateFormModal = ({ open, onCreate, onCancel, initialValues, callAPI, updateTotal }) => {
    const [formInstance, setFormInstance] = useState();
    return (
        <Modal
            open={open}
            title="Thêm mới y tá"
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
                    callAPI(values);
                    updateTotal();
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
const AddResult = ({ callAPI, updateTotal }) => {
    const [formValues, setFormValues] = useState();
    const [open, setOpen] = useState(false);
    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        setFormValues(values);
        setOpen(false);
    };
    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Thêm kế hoạch điều trị
            </Button>
            <CollectionCreateFormModal
                open={open}
                onCreate={onCreate}
                onCancel={() => setOpen(false)}
                initialValues={{
                    modifier: 'public',
                }}
                callAPI={callAPI}
                updateTotal={updateTotal}
            />
        </>
    );
};
export default AddResult;
