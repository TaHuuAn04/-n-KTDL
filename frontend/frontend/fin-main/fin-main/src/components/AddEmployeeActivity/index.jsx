import { Button, Form, Input, Modal, Select } from 'antd';
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
                name="diagnose"
                label="Chẩn đoán"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập chẩn đoán',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                name="method"
                label="Phương pháp đề nghị"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn phương pháp!',
                    },
                ]}
            >
                <Select id="floor" placeholder="Vui lòng chọn phương pháp" onChange={handleFloorChange}>
                    <Option value="Nội soi">Nội soi</Option>
                    <Option value="Siêu âm">Siêu âm</Option>
                    <Option value="Khám Tổng">Khám Tổng Quát</Option>
                    <Option value="X-Ray">X-Ray</Option>
                    <Option value="CT Scan">CT Scan</Option>
                    <Option value="Xét Nghiệm">Xét Nghiệm</Option>
                    <Option value="Sinh thiết">Sinh thiết</Option>
                    <Option value="Đo điện">Đo điện tim</Option>
                    <Option value="Phẩu thuật">Phẩu thuật</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="point_description"
                label="Mô tả chỉ định"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mô tả chỉ định',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
        </Form>
    );
};
const CollectionCreateFormModal = ({ open, onCreate, onCancel, initialValues, callAPI }) => {
    const [formInstance, setFormInstance] = useState();
    return (
        <Modal
            open={open}
            title="Thêm hoạt động khám"
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
                    const newValue = {
                        ...values,
                        // time: '12-03-2024',
                        doctor_appointed_name: 'Trương Văn Nghĩa',
                        doctor_appointed_id: 'BSNTH032146',
                        // doctor_performed_name: 'Trương Thanh An',
                        // doctor_performed_id: 'BSNTH034890',
                        status: 'Chờ khám',
                        result: '',
                    };
                    console.log(newValue);

                    callAPI(newValue);
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
const AddDoctorActivity = ({ callAPI }) => {
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
                Thêm hoạt động khám
            </Button>
            <CollectionCreateFormModal
                open={open}
                onCreate={onCreate}
                onCancel={() => setOpen(false)}
                initialValues={{
                    modifier: 'public',
                }}
                callAPI={callAPI}
            />
        </>
    );
};
export default AddDoctorActivity;
