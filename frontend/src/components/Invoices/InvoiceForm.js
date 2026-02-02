import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Card,
    Typography,
    Space,
    InputNumber,
    Table,
    message,
    Divider
} from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { createInvoice, clearError, clearSuccess } from '../../redux/slices/invoiceSlice';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const InvoiceForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { customers } = useSelector((state) => state.customers);
    const { loading, error, success } = useSelector((state) => state.invoices);

    const [items, setItems] = useState([{ name: '', quantity: 1, rate: 0 }]);
    const [subtotal, setSubtotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success) {
            message.success('Invoice created successfully!');
            dispatch(clearSuccess());
            navigate('/invoices');
        }
    }, [success, dispatch, navigate]);

    // Calculate amounts whenever items change
    useEffect(() => {
        const newSubtotal = items.reduce((sum, item) => {
            const amount = (item.quantity || 0) * (item.rate || 0);
            return sum + amount;
        }, 0);

        const newTaxAmount = (newSubtotal * 18) / 100;
        const newTotalAmount = newSubtotal + newTaxAmount;

        setSubtotal(newSubtotal);
        setTaxAmount(newTaxAmount);
        setTotalAmount(newTotalAmount);
    }, [items]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, rate: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const handleSubmit = (values) => {
        // Validate items
        const validItems = items.filter(item => item.name && item.quantity > 0 && item.rate >= 0);

        if (validItems.length === 0) {
            message.error('Please add at least one valid item');
            return;
        }

        const invoiceData = {
            customer: values.customer,
            invoiceDate: values.invoiceDate ? values.invoiceDate.toISOString() : new Date().toISOString(),
            items: validItems,
        };

        dispatch(createInvoice(invoiceData));
    };

    const itemColumns = [
        {
            title: 'Item Name',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            render: (_, record, index) => (
                <Input
                    placeholder="Enter item name"
                    value={record.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                />
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '15%',
            render: (_, record, index) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleItemChange(index, 'quantity', value)}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Rate (₹)',
            dataIndex: 'rate',
            key: 'rate',
            width: '20%',
            render: (_, record, index) => (
                <InputNumber
                    min={0}
                    precision={2}
                    value={record.rate}
                    onChange={(value) => handleItemChange(index, 'rate', value)}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Amount (₹)',
            dataIndex: 'amount',
            key: 'amount',
            width: '20%',
            render: (_, record) => (
                <Text strong>₹{((record.quantity || 0) * (record.rate || 0)).toFixed(2)}</Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: '5%',
            render: (_, record, index) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/invoices')}
                style={{ marginBottom: '16px' }}
            >
                Back to Invoices
            </Button>

            <Card>
                <Title level={2}>Create New Invoice</Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        invoiceDate: dayjs(),
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Form.Item
                                label="Customer"
                                name="customer"
                                rules={[{ required: true, message: 'Please select a customer' }]}
                            >
                                <Select
                                    placeholder="Select a customer"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {customers.map((customer) => (
                                        <Option key={customer._id} value={customer._id}>
                                            {customer.name} - {customer.email}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Invoice Date"
                                name="invoiceDate"
                                rules={[{ required: true, message: 'Please select invoice date' }]}
                            >
                                <DatePicker
                                    size="large"
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <Title level={4} style={{ margin: 0 }}>Items</Title>
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={addItem}
                                >
                                    Add Item
                                </Button>
                            </div>

                            <Table
                                columns={itemColumns}
                                dataSource={items}
                                pagination={false}
                                rowKey={(record, index) => index}
                                bordered
                            />
                        </div>

                        <Divider />

                        <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Subtotal:</Text>
                                    <Text strong>₹{subtotal.toFixed(2)}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Tax (18%):</Text>
                                    <Text strong>₹{taxAmount.toFixed(2)}</Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Title level={4} style={{ margin: 0 }}>Total Amount:</Title>
                                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                        ₹{totalAmount.toFixed(2)}
                                    </Title>
                                </div>
                            </Space>
                        </div>

                        <Form.Item>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={() => navigate('/invoices')}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading} size="large">
                                    Create Invoice
                                </Button>
                            </Space>
                        </Form.Item>
                    </Space>
                </Form>
            </Card>
        </div>
    );
};

export default InvoiceForm;
