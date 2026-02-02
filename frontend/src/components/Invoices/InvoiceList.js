import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Typography, Card, Select, Tag, message } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { fetchInvoices, setFilters, setPagination, clearError } from '../../redux/slices/invoiceSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';

const { Title } = Typography;
const { Option } = Select;

const InvoiceList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { invoices, loading, error, pagination, filters } = useSelector((state) => state.invoices);
    const { customers } = useSelector((state) => state.customers);

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    useEffect(() => {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
        };

        if (filters.customerId) {
            params.customerId = filters.customerId;
        }

        dispatch(fetchInvoices(params));
    }, [dispatch, pagination.page, pagination.limit, filters.customerId]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleCustomerFilter = (value) => {
        setSelectedCustomer(value);
        dispatch(setFilters({ customerId: value || null }));
        dispatch(setPagination({ page: 1 }));
    };

    const handleTableChange = (paginationConfig) => {
        dispatch(setPagination({ page: paginationConfig.current }));
    };

    const columns = [
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
            render: (text) => (
                <Space>
                    <FileTextOutlined />
                    <Tag color="blue">{text}</Tag>
                </Space>
            ),
        },
        {
            title: 'Customer Name',
            dataIndex: ['customer', 'name'],
            key: 'customerName',
            render: (text, record) => record.customer?.name || 'N/A',
        },
        {
            title: 'Customer Email',
            dataIndex: ['customer', 'email'],
            key: 'customerEmail',
            render: (text, record) => record.customer?.email || 'N/A',
        },
        {
            title: 'Invoice Date',
            dataIndex: 'invoiceDate',
            key: 'invoiceDate',
            render: (date) => new Date(date).toLocaleDateString('en-IN'),
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            render: (amount) => `₹${amount.toFixed(2)}`,
            align: 'right',
        },
        {
            title: 'Tax (18%)',
            dataIndex: 'taxAmount',
            key: 'taxAmount',
            render: (amount) => `₹${amount.toFixed(2)}`,
            align: 'right',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => (
                <Tag color="green" style={{ fontSize: '14px', padding: '4px 8px' }}>
                    ₹{amount.toFixed(2)}
                </Tag>
            ),
            align: 'right',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<FileTextOutlined />}
                    onClick={() => navigate(`/invoices/${record._id}`)}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={2} style={{ margin: 0 }}>Invoices</Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/invoices/create')}
                            size="large"
                        >
                            Create Invoice
                        </Button>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <Space>
                            <span>Filter by Customer:</span>
                            <Select
                                placeholder="All Customers"
                                style={{ width: 250 }}
                                allowClear
                                value={selectedCustomer}
                                onChange={handleCustomerFilter}
                                showSearch
                                optionFilterProp="children"
                            >
                                {customers.map((customer) => (
                                    <Option key={customer._id} value={customer._id}>
                                        {customer.name}
                                    </Option>
                                ))}
                            </Select>
                        </Space>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={invoices}
                    loading={loading}
                    rowKey="_id"
                    onChange={handleTableChange}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        showTotal: (total) => `Total ${total} invoices`,
                        showSizeChanger: false,
                    }}
                />
            </Card>
        </div>
    );
};

export default InvoiceList;
