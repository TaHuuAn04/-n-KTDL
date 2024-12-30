import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Homepage from './Homepage';
import OrderManagementToPay from './OrderManagementToPay';
import Userinfor from './userinfor';
import Login from './login';
import OrderManagementComplete from './OrderManagementCompleted';
import OrderManagementCancelled from './OrderManagementCancelled';
import ViewPurchaseHistory from './Management_Order';
import CreateAcc from './CreateAcc';
import OrderManagementToShip from './OrderManagementToShip';
import { CartProvider } from './CartContext';
import CartPage from './Cart';
import ChangePassword from './ChangePassword';
import Update_Infor from './Update_Infor';
import ScrollToTop from './ScrollTop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route >
        <Route index element={<Navigate to="/Login" />} />
        <Route path="Homepage" element={<Homepage />} />
        <Route path="Cart" element={<CartPage />} />
        </Route>
        <Route path="Login" element={<Login />} />
        <Route path="Order_Management/ToPay" element={<OrderManagementToPay />} />
        <Route path="Manage_Personal_Information" element={<Userinfor />} />
        <Route path="Order_Management/Completed" element={<OrderManagementComplete />} />
        <Route path="Order_Management/Cancelled" element={<OrderManagementCancelled />} />
        <Route path="View_Purchase_History" element={<ViewPurchaseHistory />} />
        <Route path="Create_Account" element={<CreateAcc />} />
        <Route path="Order_Management/ToShip" element={<OrderManagementToShip />} />
        <Route path="Update_Information" element={<Update_Infor />} />
        <Route path='change_password' element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
    
    </CartProvider>
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
