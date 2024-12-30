import React, { useState, useEffect, createContext, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    
    const savedCart = localStorage.getItem('cart');
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      alert("Sản phẩm đã được thêm vào giỏ hàng !");
      const newCart = [...prevCart, { ...product, quantity }];
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(product => product._id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);