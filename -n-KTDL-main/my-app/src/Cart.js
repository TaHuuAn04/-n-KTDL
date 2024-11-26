import "./CartStyle.css";
import React from 'react';
import { useCart } from './CartContext';  // Import hook từ CartContext
import product_detail from "../src/images/product_detail.png";
import { current } from "@reduxjs/toolkit";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const CartPage = () => {
    const { cart, removeFromCart } = useCart();  // Truy cập giỏ hàng và các hàm từ context
    const { quantity} = useCart();
    const { userInfo } = useAuth();
    const [customerMaxCustID, setCustomerMaxCustID] = useState();
    

    // const customerID = useInfo.custID;



    // Hàm xử lý khi người dùng click BUY
    // const handleBuyNow = () => {
    //     if (cart.length > 0) {
    //         // Xử lý logic khi mua hàng
    //         alert('Proceeding to checkout...');
            
    //     } else {
    //         alert('Your cart is empty!');
    //     }
    // };

    const { clearCart } = useCart();  // Lấy hàm clearCart từ context
    const [formattedDate, setFormattedDate] = useState();

    const handleClearCart = () => {
        clearCart();  // Gọi hàm clearCart để xóa giỏ hàng
    };



    const handleSubmit = async (item) => {
        // e.preventDefault();
    
        axios.post("http://localhost:3001/Order_Sale", {
            "Order ID": "",
            "Cust ID": userInfo.custID,
            "Gender": "",
            "Age": 1,
            "Age Group": "",
            "Date": "",
            "Month": "",
            "Status": "...",
            "Chanel": "",
            "SKU": item["SKU Code"],
            "Category": item.Category,
            "Size": item.Size,
            "Qty": item.quantity,
            "currency": "",
            "Amount": item.quantity * item.Price,
            "ship-city": userInfo.city,
            "ship-state": "",
            "ship-postal-code": 1,
            "ship-country": userInfo.country,
            "B2B": false
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
        alert('Đã đặt hàng thành công!')
    };



    return (
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
                                    <img className="image-cart-product" src={product_detail} alt={item.Name} />
                                </div>

                                <div className="cart-infor-wrap">
                                <div className="cart-infor-pro">
                                    <ul><a>Name:</a> <nav> {item.Name} </nav></ul>
                                    <ul><a>Category:</a> <nav> {item.Category} </nav></ul>
                                    <ul><a>Size:</a> <nav> {item.Size} </nav></ul>
                                    <ul><a>Color:</a> <nav> {item.Color} </nav></ul>
                                    <ul><a>Supplier:</a> <nav> {item.Supplier || item.SupplierID} </nav></ul>
                                    <ul><a>Quanity:</a> <nav> {item.quantity} </nav></ul>
                                    <ul><a>Price:</a> <nav> {item.Price} </nav></ul>
                                    <ul><a>Cost:</a> <nav> {item.quantity * item.Price} </nav></ul>
                                </div>

                                <div className="cart-remove"><button onClick={() => removeFromCart(item.index)}>Remove</button></div>
                                <div className="buy-cart">
                                        <button onClick={() => {handleSubmit(item); removeFromCart(item.index)}}>Buy product</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        </>
                    ))}
                    <div className="cart-total"><p>Total: {cart.reduce((total, item) => total + (item.quantity * item.Price), 0)} </p> </div>
                    
                    
                </div>
            ) : (
                <p className="empty-cart-text">!!! Your cart is empty !!!</p>
            )}
            {/* <div className="buy-cart"> <button 
            // onClick={handleBuyNow}
            >BUY</button> </div> */}
        </div>
    );
};

export default CartPage;