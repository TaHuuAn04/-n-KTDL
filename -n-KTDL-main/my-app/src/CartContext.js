// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Tạo CartContext
// const CartContext = createContext();

// // Tạo CartProvider để bao bọc các component cần truy cập giỏ hàng
// export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState([]);

//     // Lấy giỏ hàng từ localStorage khi trang được load lần đầu
//     useEffect(() => {
//         const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
//         setCart(storedCart);
//     }, []);

//     // Cập nhật giỏ hàng vào localStorage mỗi khi giỏ hàng thay đổi
//     useEffect(() => {
//         if (cart.length > 0) {
//             localStorage.setItem('cart', JSON.stringify(cart));
//         } 
        
//     }, [cart]);

//     // Thêm sản phẩm vào giỏ hàng
//     const addToCart = (product) => {
//         setCart((prevCart) => {
//             const newCart = [...prevCart, product];
//             return newCart;
//         });
//     };

//     // Xóa sản phẩm khỏi giỏ hàng
//     const removeFromCart = (productId) => {
//         setCart((prevCart) => {
//             const newCart = prevCart.filter((item) => item.id !== productId);
//             return newCart;
//         });
//     };

//     // const removeFromCart = (productId) => {
//     //     console.log('Removing product with id:', productId);
//     //     setCart((prevCart) => {
//     //         const newCart = prevCart.filter((item) => item.id !== productId);
//     //         console.log('New cart:', newCart);
//     //         return newCart;
//     //     });
//     // };


//     return <CartContext.Provider value={{
//         cart,
//         addToCart,
//         removeFromCart,
//     }}
    
//     >
        
//         {children}</CartContext.Provider>;
// }


// export default CartProvider;

// export const useCart = () => useContext(CartContext);





import React, { useState, useEffect, createContext, useContext } from 'react';

// Tạo context Cart
const CartContext = createContext();



export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Lấy giỏ hàng từ localStorage nếu có
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]); // Chạy lại mỗi khi giỏ hàng thay đổi

  

const addToCart = (product, quantity) => {
    setCart((prevCart) => {
        alert("Sản phẩm đã được thêm vào giỏ hàng !")
      const newCart = [...prevCart, { ...product, quantity }];
      // Lưu giỏ hàng mới vào localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  // Hàm để xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(product => product.index !== productId);
      // Lưu giỏ hàng mới vào localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  // Hàm để xóa toàn bộ sản phẩm trong giỏ hàng
  const clearCart = () => {
    setCart([]);  // Đặt giỏ hàng về mảng rỗng
    // Xóa giỏ hàng khỏi localStorage
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng context ở bất kỳ đâu
export const useCart = () => useContext(CartContext);






// back up

// import React, { useState, useEffect, createContext, useContext } from 'react';

// // Tạo context Cart
// const CartContext = createContext();

// // CartProvider để cung cấp context cho các component con
// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     // Lấy giỏ hàng từ localStorage nếu có
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   useEffect(() => {
//     if (cart.length > 0) {
//       localStorage.setItem('cart', JSON.stringify(cart));
//     }
//   }, [cart]); // Chạy lại mỗi khi giỏ hàng thay đổi

//   // Hàm để thêm sản phẩm vào giỏ hàng
//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       const newCart = [...prevCart, product];
//       // Lưu giỏ hàng mới vào localStorage
//       localStorage.setItem('cart', JSON.stringify(newCart));
//       return newCart;
//     });
//   };

//   // Hàm để xóa sản phẩm khỏi giỏ hàng
//   const removeFromCart = (productId) => {
//     setCart((prevCart) => {
//       const newCart = prevCart.filter(product => product._id !== productId);
//       // Lưu giỏ hàng mới vào localStorage
//       localStorage.setItem('cart', JSON.stringify(newCart));
//       return newCart;
//     });
//   };

//   // Hàm để xóa toàn bộ sản phẩm trong giỏ hàng
//   const clearCart = () => {
//     setCart([]);  // Đặt giỏ hàng về mảng rỗng
//     // Xóa giỏ hàng khỏi localStorage
//     localStorage.removeItem('cart');
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Hook để sử dụng context ở bất kỳ đâu
// export const useCart = () => useContext(CartContext);


//back up




// import React, { createContext, useState, useContext } from 'react';

// // Tạo context Cart
// const CartContext = createContext();

// // CartProvider để cung cấp context cho các component con
// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     // Lấy giỏ hàng từ localStorage nếu có
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // Hàm để thêm sản phẩm vào giỏ hàng
//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       const newCart = [...prevCart, product];
//       // Lưu giỏ hàng mới vào localStorage
//       localStorage.setItem('cart', JSON.stringify(newCart));
//       return newCart;
//     });
//   };

//   // Hàm để xóa sản phẩm khỏi giỏ hàng
//   const removeFromCart = (skuCode) => {
//     setCart((prevCart) => {
//       const newCart = prevCart.filter(product => product["SKU Code"] !== skuCode);
//       // Lưu giỏ hàng mới vào localStorage
//       localStorage.setItem('cart', JSON.stringify(newCart));
//       return newCart;
//     });
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Hook để sử dụng context ở bất kỳ đâu
// export const useCart = () => useContext(CartContext);







// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Tạo CartContext
// const CartContext = createContext();

// // Tạo CartProvider để bao bọc các component cần truy cập giỏ hàng
// export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState([]);

//     // Lấy giỏ hàng từ localStorage khi trang được load lần đầu
//     useEffect(() => {
//         const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
//         setCart(storedCart);
//     }, []);

//     // Cập nhật giỏ hàng vào localStorage mỗi khi giỏ hàng thay đổi
//     useEffect(() => {
//         localStorage.setItem('cart', JSON.stringify(cart));
//     }, [cart]);

//     // Thêm sản phẩm vào giỏ hàng
//     const addToCart = (product) => {
//         setCart((prevCart) => {
//             const newCart = [...prevCart, product];
//             return newCart;
//         });
//     };

//     // Xóa sản phẩm khỏi giỏ hàng
//     const removeFromCart = (productId) => {
//         setCart((prevCart) => {
//             const newCart = prevCart.filter((item) => item.id !== productId);
//             return newCart;
//         });
//     };

//     // Giá trị của CartContext
//     const value = {
//         cart,
//         addToCart,
//         removeFromCart,
//     };

//     return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// // Hook để sử dụng CartContext
// export const useCart = () => {
//     return useContext(CartContext);
// };