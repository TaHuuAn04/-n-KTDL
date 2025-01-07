import './App.css';
import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Product from './pages/Product.jsx';
import Employee from './pages/Employee';
import AuthProvider from './AuthContext';
import CustomerDetail from './components/CustomerDetail';
import CustomerOrder from './components/CustomerSchedule';
import Login from './pages/Login';
import Customer from './pages/Customer.jsx';
import { SearchProvider } from './SearchContext';
import InfoEmployee from './components/employee-compo/infoEmployee';
import Summary from './pages/summary.jsx';
import Order from './pages/Order';
function App() {
    return (
        <AuthProvider>
            <SearchProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/product" index element={<Product />} />
                    <Route path="/employee" index element={<Employee />} />
                    <Route path="/summary" index element={<Summary />} />
                    <Route path="/info/:id" index element={<InfoEmployee />} />
                    <Route path="/customer" index element={<Customer />} />
                    <Route path="/customer-detail/:id" element={<CustomerDetail />} />
                    <Route path="/customer-order/:id" element={<CustomerOrder />} />
                    <Route path="/order" index element={<Order />} />
                </Routes>
            </SearchProvider>
        </AuthProvider>
    );
}

export default App;
