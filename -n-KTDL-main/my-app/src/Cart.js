import "./CartStyle.css";
import React from 'react';
import { useCart } from './CartContext';
import product_detail from "../src/images/product_detail.png";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const isFirstRender = useRef(true);
    const handleClearCart = () => {
        clearCart();
      };

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    if (isFirstRender.current) {
                        alert("Vui lòng đăng nhập để xác thực!");
                        isFirstRender.current = false;
                        navigate("/Login");
                    }
                    return;
                }

                const decodedToken = jwtDecode(token);
                const custID = decodedToken.custID;

                const response = await axios.get(`http://localhost:3000/customers/search?custID=${custID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setUserInfo(response.data.customer);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
                alert('Đã xảy ra lỗi!');
            }
        };

        fetchCustomerData();
    }, [navigate]);

    
    const handleSubmit = async (item) => {
        try {
            const token = sessionStorage.getItem('token');
            // if (!token) {
            //     alert("Vui lòng đăng nhập!");
            //     navigate("/Login");
            //     return;
            // }

            // const decodedToken = jwtDecode(token);
            // const custID = decodedToken.custID;

            const orderData = {
                SKU: item['SKU Code'],
                Qty: item.quantity,
                Channel: "Online",
                ship_city: userInfo["City"],
                ship_state: "Unknown",
                ship_postal_code: null,
                ship_country: userInfo["Country"],
                B2B: false,
            };

            const response = await axios.post('http://localhost:3000/orders/add', orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert("Đơn hàng đã được tạo thành công!");
                removeFromCart(item._id);
            } else {
                alert("Có lỗi xảy ra khi tạo đơn hàng");
            }
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            alert("Vui lòng đăng nhập lại để xác thực!");
            navigate("/Login")
        }
    };

    return (
        <>
        <Headerall />
        <div className="cart-wrapper">
            <h1 className="your-cart">Your Cart</h1>
            <div className="clear-all-cart"><button onClick={handleClearCart}>Clear Cart</button></div>
            {cart.length > 0 ? (
                <div >
                    
                    {cart.map(item => (
                        <>
                        
                        <div className="back-gr-cart">
                            <div className="cart-main">
                                <div className="cart-pro-image">
                                    <img className="image-cart-product" style={{width: "300px", height: "300px"}} src={product_detail} alt={item.Name} />
                                </div>

                                <div className="cart-infor-wrap">
                                <div className="cart-infor-pro">
                                    <ul style={{alignItems: "flex-start"}}><a>Name:</a> <nav> {item.Name} </nav></ul>
                                    <ul><a>Category:</a> <nav> {item.Category} </nav></ul>
                                    <ul><a>Size:</a> <nav> {item.Size} </nav></ul>
                                    <ul><a>Color:</a> <nav> {item.Color} </nav></ul>
                                    <ul><a>Supplier:</a> <nav> {item.Supplier || item.SupplierID} </nav></ul>
                                    <ul><a>Quanity:</a> <nav> {item.quantity} </nav></ul>
                                    <ul><a>Price:</a> <nav> {item.Price} </nav></ul>
                                    <ul><a>Cost:</a> <nav> {item.quantity * item.Price} </nav></ul>
                                </div>

                                <div className="cart-remove"><button onClick={() => removeFromCart(item._id)}>Remove</button></div>
                                <div className="buy-cart">
                                        <button onClick={() => handleSubmit(item)}>Buy product</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        </>
                    ))}
                    <div className="cart-total"><p>Total: {cart.reduce((total, item) => total + (item.quantity * item.Price), 0)} </p> </div>
                    
                    
                </div>
            ) : (
                <p className="empty-cart-text">Your cart is empty!</p>
            )}
            
        </div>
        <Footer />
        </>
    );
};

export default CartPage;