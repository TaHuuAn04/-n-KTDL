import './App.css';
import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Product from './pages/Product.jsx';
import Employee from './pages/Employee.jsx';
import AuthProvider from './AuthContext.jsx';
import PatientDetail from './components/CustomerDetail/index.jsx';
import PatientSchedule from './components/CustomerSchedule/index.jsx';
import Login from './pages/Login.jsx';
import Customer from './pages/Customer.jsx';
import { SearchProvider } from './SearchContext.jsx';
// import Yta from './pages/Yta'
function App() {
    return (
        <AuthProvider>
            <SearchProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" index element={<Product />} />
                    <Route path="/doctor" index element={<Employee />} />
                    <Route path="/medicine" index element={<Product />} />
                    <Route path="/patient" index element={<Customer />} />
                    <Route path="/patient-detail" element={<PatientDetail />} />
                    <Route path="/patient-schedule" element={<PatientSchedule />} />
                </Routes>
            </SearchProvider>
        </AuthProvider>
    );
}

export default App;
