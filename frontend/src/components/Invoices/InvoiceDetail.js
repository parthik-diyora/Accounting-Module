import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Descriptions, Table, Button, Space, Tag, Divider, Spin, message } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined, FileTextOutlined } from '@ant-design/icons';
import { fetchInvoiceById, clearCurrentInvoice } from '../../redux/slices/invoiceSlice';

const { Title, Text } = Typography;

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentInvoice, loading, error } = useSelector((state) => state.invoices);

    useEffect(() => {
        dispatch(fetchInvoiceById(id));
        return () => {
            dispatch(clearCurrentInvoice());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    if (loading || !currentInvoice) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin size="large" tip="Loading Invoice Details..." />
            </div>
        );
    }

    const itemColumns = [
        {
            title: 'Item Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right',
        },
        {
            title: 'Rate (₹)',
            dataIndex: 'rate',
            key: 'rate',
            align: 'right',
            render: (value) => value.toFixed(2),
        },
        {
            title: 'Amount (₹)',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (value) => <Text strong>{value.toFixed(2)}</Text>,
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/invoices')}>
                    Back to Invoices
                </Button>
                <Button icon={<PrinterOutlined />} type="primary" onClick={() => window.print()}>
                    Print Invoice
                </Button>
            </div>

            <Card className="invoice-card" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <Space align="center">
                            <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Title level={2} style={{ margin: 0 }}>INVOICE</Title>
                        </Space>
                        <div style={{ marginTop: '8px' }}>
                            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                                {currentInvoice.invoiceNumber}
                            </Tag>
                        </div>
                    </div>
                </div>

                <Divider />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div>
                        <Text type="secondary" strong>BILLED TO:</Text>
                        <div style={{ marginTop: '8px' }}>
                            <Title level={4} style={{ margin: '0 0 4px 0' }}>{currentInvoice.customer?.name}</Title>
                            <Text>{currentInvoice.customer?.email}</Text><br />
                            <Text>{currentInvoice.customer?.phone}</Text>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Descriptions column={1} size="small" colon={false}>
                            <Descriptions.Item label={<Text type="secondary" strong>DATE</Text>}>
                                {new Date(currentInvoice.invoiceDate).toLocaleDateString('en-IN')}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <Table
                        columns={itemColumns}
                        dataSource={currentInvoice.items}
                        pagination={false}
                        rowKey={(record, index) => index}
                        bordered={false}
                    />
                </div>

                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '300px' }}>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Subtotal">
                                ₹{currentInvoice.subtotal.toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label={`Tax (${currentInvoice.tax}%)`}>
                                ₹{currentInvoice.taxAmount.toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Text strong style={{ fontSize: '18px' }}>TOTAL</Text>}>
                                <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                                    ₹{currentInvoice.totalAmount.toFixed(2)}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Card>

            <style>{`
                @media print {
                    .ant-layout-header, button, .ant-btn {
                        display: none !important;
                    }
                    .invoice-card {
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvoiceDetail;
