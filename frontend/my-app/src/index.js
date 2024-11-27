import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from './redux/store';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './Homepage';
import OrderManagementToPay from './OrderManagementToPay';
import Userinfor from './userinfor';
import Order from './Order';
import Login from './login';
import Product from './Product';
import OrderDetail from './OrderDetail';
import OrderManagementComplete from './OrderManagementCompleted';
import OrderManagementCancelled from './OrderManagementCancelled';
import ViewPurchaseHistory from './ViewPurchaseHistory';
import CreateAcc from './CreateAcc';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="Order" element={<Order />} />
        <Route path="Login" element={<Login />} />
        <Route path="Order_Management_ToPay" element={<OrderManagementToPay />} />
        <Route path="Manage_Personal_Information" element={<Userinfor />} />
        <Route path="Product" element={<Product />} />
        <Route path="Order_Detail" element={<OrderDetail />} />
        <Route path="Order_Management_Completed" element={<OrderManagementComplete />} />
        <Route path="Order_Management_Cancelled" element={<OrderManagementCancelled />} />
        <Route path="View_Purchase_History" element={<ViewPurchaseHistory />} />
        <Route path="Create_Account" element={<CreateAcc />} />
      </Routes>
    </BrowserRouter>
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
