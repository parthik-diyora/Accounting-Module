import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Typography, Card, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { fetchCustomers, createCustomer, clearError, clearSuccess, setPagination } from '../../redux/slices/customerSlice';

const { Title } = Typography;

const CustomerList = () => {
    const dispatch = useDispatch();
    const { customers, loading, error, success, pagination } = useSelector((state) => state.customers);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchCustomers({
            page: pagination.page,
            limit: pagination.limit
        }));
    }, [dispatch, pagination.page, pagination.limit]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success) {
            message.success('Customer created successfully!');
            dispatch(clearSuccess());
            setIsModalVisible(false);
            form.resetFields();
        }
    }, [success, dispatch, form]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        dispatch(createCustomer(values));
    };

    const handleTableChange = (paginationConfig) => {
        dispatch(setPagination({ page: paginationConfig.current }));
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Space>
                    <UserOutlined />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => (
                <Space>
                    <MailOutlined />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => (
                <Space>
                    <PhoneOutlined />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2} style={{ margin: 0 }}>Customers</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        size="large"
                    >
                        Add Customer
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={customers}
                    loading={loading}
                    rowKey="_id"
                    onChange={handleTableChange}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        showTotal: (total) => `Total ${total} customers`,
                        showSizeChanger: false,
                    }}
                />
            </Card>

            <Modal
                title="Add New Customer"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter customer name' },
                            { min: 2, message: 'Name must be at least 2 characters' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter customer name"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Enter email address"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            { required: true, message: 'Please enter phone number' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Enter 10-digit phone number"
                            size="large"
                            maxLength={10}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Create Customer
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomerList;
