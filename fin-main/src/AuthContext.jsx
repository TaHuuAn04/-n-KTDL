import { createContext, useContext, useEffect, useState } from "react";
import React from 'react';

const  AuthContext = createContext();

function AuthProvider ({children})  {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData  = JSON.parse(localStorage.getItem('userData'));
        const isAdmin = localStorage.getItem('isAdmin');

        if (isLoggedIn === 'true' && userData) {
            setLoggedIn(true);
            setUserInfo(userData);
            setIsAdmin(isAdmin==='true');
        }
    },[]);

    const handleLogin = (userData,isAdmin) => {
        setLoggedIn(true)
        setUserInfo(userData)
        setIsAdmin(isAdmin)

        localStorage.setItem("isLoggedIn","true")
        localStorage.setItem("userData",JSON.stringify(userData))
        localStorage.setItem("isAdmin", isAdmin ? "true":"false")

    }

    const handleLogout = () => {

        setLoggedIn(false)
        setUserInfo({})
        setIsAdmin(false)
        
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
        localStorage.removeItem("isAdmin");

    }
    return (
        <AuthContext.Provider
        value={{
            loggedIn,
            userInfo,
            isAdmin,
            handleLogout,
            handleLogin,
            setLoggedIn
        }}

        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);