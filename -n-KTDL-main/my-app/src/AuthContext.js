import { createContext, useContext, useEffect, useState } from "react";
import React from 'react';


const  AuthContext = createContext();

function AuthProvider ({children})  {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    // const [isAdmin, setIsAdmin] = useState(false);
    // const [orders, setOrders] = useState([]); // Thêm trạng thái orders
    

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData  = JSON.parse(localStorage.getItem('userData'));
        // const isAdmin = localStorage.getItem('isAdmin');
        // const userOrders = JSON.parse(localStorage.getItem('userOrders')); // Lấy thông tin đơn hàng từ localStorage

        if (isLoggedIn === 'true' && userData) {
            setLoggedIn(true);
            setUserInfo(userData);
            // setIsAdmin(isAdmin==='true');
            // setOrders(userOrders || []);
        }
    },[]);

    const handleLogin = (userData) => {
        setLoggedIn(true)
        setUserInfo(userData)
        // setIsAdmin(isAdmin)
        // setOrders(userOrders); // Cập nhật trạng thái orders

        localStorage.setItem("isLoggedIn","true")
        localStorage.setItem("userData",JSON.stringify(userData))
        // localStorage.setItem("isAdmin", isAdmin ? "true":"false")
        // localStorage.setItem("userOrders", JSON.stringify(userOrders)); // Lưu thông tin đơn hàng vào localStorage

    }

    const handleLogout = () => {

        setLoggedIn(false)
        setUserInfo({})
        // setIsAdmin(false)
        // setOrders([]); // Đặt lại trạng thái orders
        
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
        // localStorage.removeItem("isAdmin");
        // localStorage.removeItem("userOrders"); // Xóa thông tin đơn hàng khỏi localStorage

    }
    return (
        <AuthContext.Provider
        value={{
            loggedIn,
            userInfo,
            // isAdmin,
            // orders, // Cung cấp trạng thái orders
            handleLogout,
            handleLogin,
            setLoggedIn,
            // setOrders // Cung cấp hàm setOrders
        }}

        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);