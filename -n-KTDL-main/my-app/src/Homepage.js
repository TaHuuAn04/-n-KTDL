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
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { useCart } from "./CartContext";

function Homepage () {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const [products, setProducts] = useState([]);
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

    // const filteredProducts = productName.filter(pro => {
    //     if (isKurtaChecked && pro.Category === "KURTA") {
    //         return true;  // Nếu isKurtaChecked là true và Category là "KURTA", thì hiển thị
    //     }
    //     if (!isKurtaChecked && pro.Category !== "KURTA") {
    //         return true;  // Nếu isKurtaChecked là false và Category không phải "KURTA", thì hiển thị
    //     }
    //     return false;  // Nếu không thỏa mãn các điều kiện trên, thì không hiển thị
    // });

    // const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    // const currentItems = productName
    //     .filter(pro => pro.Category.toLowerCase().includes(searchTerm.toLowerCase()))
    //     .slice(startIndex, startIndex + itemsPerPage);

    // const filteredProducts = currentItems.filter(pro => 
    //     pro.Category.toLowerCase().includes(searchQuery.toLowerCase()) // Assuming 'Category' is the key you want to filter
    // );
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

    const { addToCart } = useCart();  // Lấy hàm addToCart từ context

    // Hàm thêm sản phẩm vào giỏ hàng
    // const handleAddToCart = (product) => {
    //     addToCart(product);
    //     alert('Product added to cart!');
    // };

    // const handleAddToCart = () => {
    //     addToCart(product, quantity);
    //   };

      const [quantity, setQuantity] = useState(1);

    const { cart, removeFromCart } = useCart();  // Truy cập giỏ hàng và các hàm từ context

    // Hàm xử lý khi người dùng click BUY
    const handleBuyNow = () => {
        if (cart.length > 0) {
            // Xử lý logic khi mua hàng
            alert('Proceeding to checkout...');
            // Ví dụ: gửi dữ liệu giỏ hàng đến backend để tạo đơn hàng
        } else {
            alert('Your cart is empty!');
        }
    };

    const { clearCart } = useCart();  // Lấy hàm clearCart từ context

  const handleClearCart = () => {
    clearCart();  // Gọi hàm clearCart để xóa giỏ hàng
  };
//   const [quantity, setQuantity] = useState(1);

    return (
        <>
        

        <div className="homepage-main">
            <div className="backgr-homepage">
                <div className="homepage-wrap">
                    <div className="header-homepg">
                        <img src={imagehome1} className="image14" />
                        <ul><p>TRENDY</p> <img src={imagehome2} className="image2" /> </ul>
                        <ul> <img src={imagehome3} className="image3" /> <p>MODERN</p> </ul>
                        <img src={imagehome4} className="image14 image4" />
                    </div>
                        <div className="homepg-detail">
                            <ul>DAHH fashion store</ul>
                            <p>Discover the latest in women's fashion with our curated collection of 
                                stylish and trendy apparel. From elegant dresses to casual wear, we offer a wide range of clothing and accessories for 
                                every occasion. Shop now and elevate your wardrobe with our high-quality, affordable 
                                pieces designed to inspire confidence.
                            </p>
                            <img src={imagebuynow} className="imagebuynow" />
                        </div>
                    <div className="top-catagory">
                            <ul>TOP CATAGORIES</ul>
                            <div className="catagories">
                                <li> <img src={kurta} /> <div className="cata"> <p>KURTA</p> </div> </li>
                                <li> <img src={dress} /> <div className="cata"> <p>DRESS</p> </div> </li>
                                <li> <img src={blouse} /> <div className="cata"> <p>BLOUSE</p> </div> </li>
                                <li> <img src={pants} /> <div className="cata"> <p>PANTS</p> </div> </li>
                                <li> <img src={top} /> <div className="cata"> <p>TOP</p> </div> </li>
                            </div>
                    </div>
                    <div className="product-all">
                        <div className="product-title-homepg"> <p>PRODUCT</p> </div>
                        <nav className="use-text">
                        <p>Nhập tên Category mà bạn muốn tìm sản phẩm vào thanh tìm kiếm, bạn có thể Click vào nút <b>"Category list"</b> để có thể
                            xem được danh sách các Category mà của hàng có thể cung cấp trong thời điểm hiện tại.
                        </p>
                        <p>Sau khi tìm được sản phẩm mà bạn muốn mua, hãy Click vào nút <b>"Show more"</b> và kéo xuống dưới trang web để thấy được 
                            Size, Color, ... hiện có của sản phẩm mà Quý khách đã chọn và số lượng sản phẩm còn lại trong kho mà cửa hàng có thể cung cấp cho Quý khách trong thời điểm hiện tại.
                        </p>
                        <p>
                            Nếu Quý khách đã chọn được sản phẩm ưng ý, xin vui lòng <b>nhập số lượng sản phẩm</b> muốn mua và Click vào nút <b>"Add to cart"</b> để thêm 
                            sản phẩm vào giỏ hàng của Quý khách.
                        </p>
                        </nav>
                        <div className="search-bar-new">

                            <div className="product-filter-new">
                                <p className="product-catagory">FILTER</p>
                                <nav>
                                <ul> <input type="checkbox"></input> BEST SELLER </ul>
                                </nav>
                            </div>

                            <div className="search-category-new">
                                <input
                                type="text"
                                placeholder="Search by category..."
                                value={categorySearchTerm}
                                onChange={(e) => setCategorySearchTerm(e.target.value)}
                                />
                                <button onClick={toggleMenu}>Category list</button>
                            </div>

                            {isMenuVisible && (
                                <nav className="menu-new">
                                    <div className="rolling-wrapper">
                                    <p className="rolling-text">Dưới đây là danh sách các Category, nhập vào tên của Category nào mà bạn muốn mua vào thanh tìm kiếm</p>
                                    </div>
                                <ul>
                                    {
                                        categoryName.map((cate => {
                                            return (
                                                <div className="category-list-name">
                                                {cate.Category}
                                                </div>
                                            )
                                        }))
                                    }
                                </ul>
                                </nav>
                            )}

                            
                                <div className="filter-cost-new">
                                    <p className="product-cost">COST</p>
                                    <nav>
                                    <ul> <input type="checkbox"></input> Increase </ul>
                                    <ul> <input type="checkbox"></input> Decrease </ul>
                                    </nav>
                                </div>
                            
                        </div>



                        




                        <div className="product-orthers">

                        <div className="product-bg-homepage">
                                <div className="product-image-detail">
                                    {
                                        currentItems.map(pro => {
                                            return (
                                                <div className="homepg-image-detail">
                                                    {
                                                        <>
                                                        <nav>
                                                        <div className="product-infor-image-homepg" > <img src={product_detail} /> </div>
                                                        <p>65,00$</p>
                                                        <div className="text-product-home-page">{pro.Name}</div>
                                                        </nav>
                                                        <div className="cate-name">{pro.Category}</div>
                                                        
                                                        <button onClick={() => {
                                                            setSelectedProduct(pro);
                                                            setCurrentPageForRelated(1); //Cập nhật lại Page related = 1 khi chọn Show more 
                                                        }
                                                        } >Show More</button>
                                                        </>
                                                    }
                                                    
                                                </div>
                                            )
                                        })
                                        
                                    }
                                </div>
                                <Pagination className="pagination"
                                    current={currentPage}
                                    pageSize={itemsPerPage}
                                    total={filteredByCategory.length}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                        </div>
                        </div>




                    <div className="product-related-orthers">
                    {selectedProduct && (
                    <div className="related-products">
                        <h3>Related Products</h3>
                        <div className="related-products-list">
                            {currentRelatedProducts.map(pro => (
                                <div key={pro._id} className="related-product-item">
                                    <p>{pro.index}</p>
                                    <p>{pro.index}</p>
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
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)} 
                                            className="quantity-input"
                                        />
                                        <button 
                                            className="add-cart"
                                            onClick={() => addToCart(pro, quantity)}
                                            // onClick={handleAddToCart}
                                        >
                                        Add to cart
                                        </button>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>

                        <Pagination className="pagination"
                                current={currentPageForRelated}
                                pageSize={relatedItemsPerPage}
                                total={relatedProducts.length}  // Tổng số sản phẩm liên quan
                                onChange={handlePageChangeRelated} // Cập nhật trang khi người dùng thay đổi
                                showSizeChanger={false}  // Không cho phép thay đổi số lượng sản phẩm mỗi trang
                        />
                    </div>
                    )}
                    </div>




                    </div>
                </div>
            </div>

        </div>
        

        
        </>
    );
}

export default Homepage;