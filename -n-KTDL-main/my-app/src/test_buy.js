import React from 'react';
import { useCart } from './CartContext';
import axios from "axios";
import { useEffect, useState } from 'react';
import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./HomepageStyle.css";
import imagehome1 from "../src/images/img1.png";
import imagehome2 from "../src/images/img2.png";
import imagehome3 from "../src/images/img3.png";
import imagehome4 from "../src/images/img4.png";
import imagebuynow from "../src/images/img_buy.png";
import kurta from "../src/images/kurta.png";
import blouse from "../src/images/blouse.png";
import dress from "../src/images/dress.png";
import pants from "../src/images/pants.png";
import top from "../src/images/top.png";
import product_detail from "../src/images/product_detail.png";
import { Link } from "react-router-dom";


import { Pagination } from "antd";


const ProductList_test = () => {
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
    { id: 3, name: 'Product 3', price: 30 }
  ];

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const [setProducts] = useState([]);
    const [categoryName, setCategory] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageForRelated, setCurrentPageForRelated] = useState(1);
    const itemsPerPage = 12;
    const relatedItemsPerPage = 8;

    const [isKurtaChecked, setIsKurtaChecked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [categories, setCategories] = useState([]);

    // const [cart, setCart] = useState([]);

    

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageChangeRelated = (pg) => {
        setCurrentPageForRelated(pg);
    };

    const handleKurtaChange = (e) => {
        // Cập nhật state khi checkbox được chọn hay không
        setIsKurtaChecked(e.target.checked);
    };

    useEffect(() => {
        axios.get("http://localhost:3001/getProduct")
        .then(response => {
            setProducts(response.data);
            
            // Lấy danh sách các Category duy nhất từ các sản phẩm
            const uniqueCategories = [...new Set(response.data.map(pro => pro.Category))];
            setCategories(uniqueCategories);
        })
        .catch(err => console.log(err))
      }, []);
    
    useEffect(() => {
        axios.get("http://localhost:3001/getCategory_Name")
        .then(categoryName => setCategory(categoryName.data))
        .catch(err => console.log(err))
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;

   
    const filteredProducts = products.filter(pro => 
        pro.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.Category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    

    const uniqueProductNamesAndCategories = filteredProducts.reduce((acc, pro) => {
        const key = pro.Name + pro.Category; // Kết hợp Name và Category làm key
        if (!acc[key]) {
            acc[key] = pro; // Chỉ thêm một sản phẩm đại diện cho mỗi nhóm Name + Category
        }
        return acc;
    }, {});

    // const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const uniqueProducts = Object.values(uniqueProductNamesAndCategories);

    const relatedProducts = selectedProduct ? products.filter(p => 
        p.Name === selectedProduct.Name && p.Category === selectedProduct.Category 
        // && p._id !== selectedProduct._id
    ) : [];

    const filteredByCategory = categorySearchTerm ? uniqueProducts.filter(pro => 
        pro.Category.toLowerCase().includes(categorySearchTerm.toLowerCase())
    ) : uniqueProducts;

    // const currentItems = uniqueProducts.slice(startIndex, startIndex + itemsPerPage);

    const currentItems = filteredByCategory.slice(startIndex, startIndex + itemsPerPage);

    const startIndexForRelated = (currentPageForRelated - 1) * relatedItemsPerPage;
    const endIndexForRelated = startIndexForRelated + relatedItemsPerPage;

    const currentRelatedProducts = relatedProducts.slice(startIndexForRelated, endIndexForRelated);


    // const handleAddToCart = (product, quantity) => {
    //     // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    //     const existingProductIndex = cart.findIndex(item => item._id === product._id);
    
    //     if (existingProductIndex >= 0) {
    //         // Nếu sản phẩm đã có trong giỏ hàng, chỉ cần cập nhật số lượng
    //         const updatedCart = [...cart];
    //         updatedCart[existingProductIndex].quantity += quantity;
    //         setCart(updatedCart);
    //     } else {
    //         // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào giỏ
    //         setCart([...cart, { ...product, quantity }]);
    //     }
    // };

    // const { cart, clearCart } = useCart();

    // const handlePurchase = async () => {
    //     try {
    //         await axios.post('http://localhost:3001/purchase', { cart });
    //         clearCart();
    //         alert('Purchase successful!');
    //     } catch (error) {
    //         console.error('Error during purchase:', error);
    //         alert('Purchase failed!');
    //     }
    // };

    // const { addToCart } = useCart();  // Lấy hàm addToCart từ context

    // Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product) => {
        addToCart(product);
        alert('Product added to cart!');
    };

  return (
    <div>
      <h2>Product List</h2>
      <ul>
      {/* {selectedProduct && (
                    <div className="related-products">
                        <h3>Related Products</h3>
                        <div className="related-products-list"> */}
                            {currentRelatedProducts.map(pro => (
                                <div key={pro._id} className="related-product-item">
                                    <img className="product-infor-image-homepg" src={product_detail} alt={pro.Name} />
                                    <p>{pro.Price || 65} </p>
                                    <div className="product-name">{pro.Name}</div>
                                    <div className="product-category">{pro.Category}</div>
                                    <div className="product-size">
                                        <a>Size: </a>
                                        <a>{pro.Size}</a>
                                    </div>
                                    <div className="product-color-bg">
                                        
                                        <nav>Color:</nav>
                                        <span className="color-box" style={{backgroundColor: pro.Color, color: pro.Color}}>Col</span>
                                        <a>{pro.Color}</a>
                                        
                                    </div>

                                    <div className="product-supplier">
                                        <nav>Supplier:</nav>
                                        <a>{pro.Supplier || pro.SupplierID}</a>
                                    </div>
                                    <div className="stock-pro">
                                        <nav>Số lượng còn:</nav>
                                        <span>{pro.Stock === "0" ? <a style={{color: "red", fontWeight: "bold"}}> Hết hàng</a> : pro.Stock}</span>
                                    </div>
                                    <div className="quantity-container">
                                        <input 
                                            type="number" 
                                            min="1" 
                                            defaultValue="1" 
                                            id={'quantity-${pro._id}'} 
                                            className="quantity-input"
                                        />
                                        <button 
                                            className="add-cart"
                                            onClick={() => handleAddToCart(pro)}
                                        >
                                        Add to cart
                                        </button>
                                    </div>
                                    
                                </div>
                            ))}
                        {/* </div>

                        <Pagination className="pagination"
                                current={currentPageForRelated}
                                pageSize={relatedItemsPerPage}
                                total={relatedProducts.length}  // Tổng số sản phẩm liên quan
                                onChange={handlePageChangeRelated} // Cập nhật trang khi người dùng thay đổi
                                showSizeChanger={false}  // Không cho phép thay đổi số lượng sản phẩm mỗi trang
                        />
                    </div>
                    )} */}
      </ul>
    </div>
  );
};

export default ProductList_test;