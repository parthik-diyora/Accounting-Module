import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import store from './redux/store';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
    return (
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 6,
                    },
                }}
            >
                <Router>
                    <AppRoutes />
                </Router>
            </ConfigProvider>
        </Provider>
    );
}

export default App;
