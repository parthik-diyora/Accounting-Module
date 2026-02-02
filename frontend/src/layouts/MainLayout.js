import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/customers',
            icon: <UserOutlined />,
            label: 'Customers',
        },
        {
            key: '/invoices',
            icon: <FileTextOutlined />,
            label: 'Invoices',
        },
    ];

    const getSelectedKey = () => {
        if (location.pathname.startsWith('/invoices')) return '/invoices';
        if (location.pathname.startsWith('/customers')) return '/customers';
        return location.pathname;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                background: '#001529',
                padding: '0 24px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%'
            }}>
                <div style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginRight: '48px',
                    cursor: 'pointer'
                }} onClick={() => navigate('/')}>
                    Accounting Module
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[getSelectedKey()]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default MainLayout;
