import './App.css';
import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Product from './pages/Product.jsx';
import Employee from './pages/Employee';
import AuthProvider from './AuthContext';
import PatientDetail from './components/CustomerDetail';
import PatientSchedule from './components/CustomerSchedule';
import Login from './pages/Login';
import Customer from './pages/Customer.jsx';
import { SearchProvider } from './SearchContext';
import InfoEmployee from './components/employee-compo/infoEmployee';
function App() {
    return (
        <AuthProvider>
            <SearchProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/product" index element={<Product />} />
                    <Route path="/employee" index element={<Employee />} />
                    <Route path="/medicine" index element={<Product />} />
                    <Route path="/info/:id" index element={<InfoEmployee />} />
                    <Route path="/customer" index element={<Customer />} />
                    <Route path="/patient-detail" element={<PatientDetail />} />
                    <Route path="/patient-schedule" element={<PatientSchedule />} />
                </Routes>
            </SearchProvider>
        </AuthProvider>
    );
}

export default App;
