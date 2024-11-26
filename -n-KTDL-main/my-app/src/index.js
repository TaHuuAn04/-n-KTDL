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
import AuthProvider from './AuthContext';
import OrderManagementToShip from './OrderManagementToShip';
import Cart from './Cart';
import { CartProvider } from './CartContext';
import CartPage from './Cart';
import ProductList from './Parent_Page';
import ProductList_test from './test_buy';
import Parent from './Parent_Page';
import ChangePassword from './ChangePassword';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
    <AuthProvider>
      
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Parent />}>
        <Route path="Homepage" element={<Homepage />} />
        <Route path="Cart" element={<CartPage />} />
        </Route>
        <Route path="Login" element={<Login />} />
        <Route path="Order_Management_ToPay" element={<OrderManagementToPay />} />
        <Route path="Manage_Personal_Information" element={<Userinfor />} />
        <Route path="Product" element={<Product />} />
        <Route path="Order_Detail" element={<OrderDetail />} />
        <Route path="Order_Management_Completed" element={<OrderManagementComplete />} />
        <Route path="Order_Management_Cancelled" element={<OrderManagementCancelled />} />
        <Route path="View_Purchase_History" element={<ViewPurchaseHistory />} />
        <Route path="Create_Account" element={<CreateAcc />} />
        <Route path="Order_Management_ToShip" element={<OrderManagementToShip />} />
        
        <Route path='change_password' element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
    
    </AuthProvider>
    </CartProvider>
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
