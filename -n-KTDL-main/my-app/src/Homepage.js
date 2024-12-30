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
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { useCart } from "./CartContext";
import ReactPaginate from "react-paginate";

function Homepage () {
    const { addToCart } = useCart();
    const [quantities, setQuantities] = useState({});

    const [groupedProducts, setGroupedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
   

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const fetchProducts = async (page) => {
        try {
          const response = await axios.get(`http://localhost:3000/products/grouped?page=${page}&limit=12`);
          setGroupedProducts(response.data.groupedProducts || []); 
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
    };

    const handlePageClick = (data) => {
        setPage(data.selected + 1);
    };

    const isValidColor = (color) => {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    };

    const [showMore, setShowMore] = useState({});

    const toggleShowMore = (index) => {
        setShowMore({ [index]: true });
      };

    
    
    const [relatedCurrentPage, setRelatedCurrentPage] = useState({});
    const relatedPageSize = 8;

    const handleRelatedPageChange = (page, index) => {
    setRelatedCurrentPage((prevState) => ({
      ...prevState,
      [index]: page,
    }));
    };
  
    const paginatedRelatedProducts = (products, index) => {
    const startIndex = ((relatedCurrentPage[index] || 1) - 1) * relatedPageSize;
    const endIndex = startIndex + relatedPageSize;
    return products.slice(startIndex, endIndex);
    };

    const handleQuantityChange = (productId, value, stock) => {
        let quantity = parseInt(value, 10);
        if (quantity < 1) {
            quantity = 1;
        } else if (quantity > stock) {
            quantity = stock;
        }
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: quantity,
        }));
    };

    const [pageFilter, setPageFilter] = useState(1);
    const [totalPagesFilter, setTotalPagesFilter] = useState(1);
    const [filters, setFilters] = useState({
        category: "",
        supplierID: "",
        priceMin: "",
        priceMax: "",
        sortBy: ""
    });

    const [products, setProducts] = useState([]);

    const isFilterEmpty = Object.values(filters).every(value => !value);
    useEffect(() => {
        if (isFilterEmpty) {
            setProducts([]);
        } else {
            fetchProduct_filter();
        }
    }, [pageFilter, filters]);

    const fetchProduct_filter = async () => {
        try {
            const response = await axios.get("http://localhost:3000/products/filter", {
                params: {
                    page: pageFilter,
                    limit: 8,
                    ...filters
                }
            });
            setProducts(response.data.products || []);
            setTotalPagesFilter(Math.ceil(response.data.totalCount / 8));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
        setPageFilter(1);
    };

    const goToNextPageFilter = () => {
        if (pageFilter < totalPagesFilter) {
            setPageFilter(pageFilter + 1);
        }
    };

    const goToPreviousPageFilter = () => {
        if (pageFilter > 1) {
            setPageFilter(pageFilter - 1);
        }
    };

    


    return (
        <>
        <Headerall />

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
                        <div className="search-bar-new">
            <input
                type="text"
                name="category"
                placeholder="Search by category..."
                value={filters.category}
                onChange={handleFilterChange}
            />
            <input
                type="text"
                name="supplierID"
                placeholder="Search by supplier ID..."
                value={filters.supplierID}
                onChange={handleFilterChange}
            />
            <input
                type="number"
                name="priceMin"
                placeholder="Min price"
                value={filters.priceMin}
                onChange={handleFilterChange}
                style={{width: "150px"}}
            />
            <input
                type="number"
                name="priceMax"
                placeholder="Max price"
                value={filters.priceMax}
                onChange={handleFilterChange}
                style={{width: "150px"}}
            />
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}
                style={{fontSize: "20px", padding: "2px", borderRadius: "10px"}}
            >
                <option value="">Sort by</option>
                <option value="price_asc">Price Ascending</option>
                <option value="price_desc">Price Descending</option>
                <option value="date_asc">Date Ascending</option>
                <option value="date_desc">Date Descending</option>
            </select>
            <button 
                style={{borderRadius: "10px", backgroundColor: "rgb(181, 38, 176)", color: "#fff", fontWeight: "450", border: "none", padding: "5px"}}
            onClick={fetchProducts}>Apply Filters</button>

            
                            
                        </div>
                        <div>
                {!isFilterEmpty && (
                <div className="product-related-orthers" style={{background: "linear-gradient(180deg,rgb(167, 239, 239) 0%,rgb(184, 242, 233) 50%,rgb(209, 232, 229) 100%)"}}>
                                                <div className="related-products">
                                                    <h3>Filtered Products</h3>
                                                    <div className="related-products-list">
                                                    {products.length > 0 ? (
                    products.map((product) => (
                        <>                     
                                                    <div key={product._id} className="related-product-item">
                                                        <img className="product-infor-image-homepg" src={product_detail} alt={product.Name} />
                                                        <p>{product.Price} </p>
                                                        <div className="product-name">{product.Name}</div>
                                                        <div className="product-category">{product.Category}</div>
                                                        <div className="product-size">
                                                            <a>Size: </a>
                                                            <a>{product.Size}</a>
                                                        </div>
                                                        <div className="product-color-bg">
                                                            <nav>Color:</nav>
                                                            <span className="color-box" style={{backgroundColor: product.Color, color: product.Color}}>{isValidColor(product.Color) ? 'Col' : ''}</span>
                                                            <a>{product.Color}</a>
                                                        </div>
        
                                                        <div className="product-supplier">
                                                            <nav>Supplier:</nav>
                                                            <a>{product.Supplier || product.SupplierID}</a>
                                                        </div>
        
                                                        <div className="stock-pro">
                                                            <nav>Số lượng còn:</nav>
                                                            <span>{product.Stock === 0 ? <a style={{color: "red", fontWeight: "bold"}}> Hết hàng</a> : product.Stock}</span>
                                                        </div>
        
                                                        <div className="quantity-container">
                                                            <div style={{justifyItems: "center"}}>
                                                                <p>Nhập số lượng cần mua</p>
                                                            <input 
                                                            type="number" 
                                                            min="1" 
                                                            max={product.Stock}
                                                            value={quantities[product._id]}
                                                            // defaultValue={1}
                                                            onChange={(e) => handleQuantityChange(product._id ,e.target.value, product.Stock)} 
                                                            disabled={product.Stock === 0}
                                                            className="quantity-input"
                                                            />
                                                            </div>
        
                                                            <button 
                                                            className="add-cart"
                                                            onClick={() => addToCart(product, quantities[product._id])}
                                                            disabled={product.Stock === 0 || isNaN(quantities[product._id])}
                                                            // onClick={handleAddToCart}
                                                            >
                                                            Add to cart
                                                            </button>
                                                        </div>
        
                                                    </div>
                                                    
                                                    </>
                                                ))
                                            ) : (
                                                <div style={{color: "black", justifyContent: "center", width: "1300px"}}>
                                                    <p style={{justifySelf: "center", fontSize: "20px", fontFamily: "montser", fontWeight: "450"}}>Không có sản phẩm nào thỏa yêu cầu! </p>
                                                </div>
                                            )}
                                                    </div>
                                                    <div className="pagination pagi-order" style={{fontSize: "20px", paddingBottom: "30px"}}>
                            <button onClick={goToPreviousPageFilter} disabled={pageFilter === 1}>
                                Previous
                            </button>
                            <span>Page {pageFilter} / {totalPagesFilter || 0}</span>
                            <button onClick={goToNextPageFilter} disabled={page === totalPagesFilter || !totalPagesFilter}>
                                Next
                            </button>
                        </div>
                                                </div>
                        
                        </div>
                        )}
            </div>
            
                        
                        
                        <div className="product-orthers">
                            <div className="product-bg-homepage">
                                <div className="product-image-detail">
                                {
                                    groupedProducts.map((group, index) => (
                                        <>
                                        <div key={index} className="homepg-image-detail">
                                    <nav>
                                        <div className="product-infor-image-homepg" > <img src={product_detail} /> </div>
                                        <p>Information</p>
                                        <div className="text-product-home-page">{group._id.name}</div>
                                    </nav>
                                    
                                    <div className="cate-name">{group._id.category}</div>
                                    
                                    {/* <button onClick={() => {
                                        setSelectedProduct(group._id);
                                        setCurrentPageForRelated(1); //Cập nhật lại Page related = 1 khi chọn Show more 
                                        }
                                        } >Show More
                                    </button> */}
                                    <button onClick={() => toggleShowMore(index)}>
                                    Show More
                                    </button>                                    
                                        </div>

                                        </>
                                        
                                ))}
                                </div>
                                <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={totalPages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                                />

                                
                        </div>
                        </div>

                        {groupedProducts.map((group, index) => (
                                            showMore[index] && (
                                                <div className="product-related-orthers">
                                                <div className="related-products">
                                                    <h3>Related Products</h3>
                                                    <div className="related-products-list">
                                                {paginatedRelatedProducts(group.products, index).map((pro) => (
                                                    <>
                                                    <div key={pro._id} className="related-product-item">
                                                        <img className="product-infor-image-homepg" src={product_detail} alt={pro.Name} />
                                                        <p>{pro.index}</p>
                                                        <p>{pro.Price} </p>
                                                        <div className="product-name">{pro.Name}</div>
                                                        <div className="product-category">{pro.Category}</div>
                                                        <div className="product-size">
                                                            <a>Size: </a>
                                                            <a>{pro.Size}</a>
                                                        </div>
                                                        <div className="product-color-bg">
                                                            <nav>Color:</nav>
                                                            <span className="color-box" style={{backgroundColor: pro.Color, color: pro.Color}}>{isValidColor(pro.Color) ? 'Col' : ''}</span>
                                                            <a>{pro.Color}</a>
                                                        </div>
        
                                                        <div className="product-supplier">
                                                            <nav>Supplier:</nav>
                                                            <a>{pro.Supplier || pro.SupplierID}</a>
                                                        </div>
        
                                                        <div className="stock-pro">
                                                            <nav>Số lượng còn:</nav>
                                                            <span>{pro.Stock === 0 ? <a style={{color: "red", fontWeight: "bold"}}> Hết hàng</a> : pro.Stock}</span>
                                                        </div>
        
                                                        <div className="quantity-container">
                                                            <div style={{justifyItems: "center"}}>
                                                                <p>Nhập số lượng cần mua</p>
                                                            <input 
                                                            type="number" 
                                                            min="1" 
                                                            max={pro.Stock}
                                                            value={quantities[pro._id]}
                                                            // defaultValue={1}
                                                            onChange={(e) => handleQuantityChange(pro._id ,e.target.value, pro.Stock)} 
                                                            disabled={pro.Stock === 0}
                                                            className="quantity-input"
                                                            />
                                                            </div>
        
                                                            <button 
                                                            className="add-cart"
                                                            onClick={() => addToCart(pro, quantities[pro._id])}
                                                            disabled={pro.Stock === 0 || isNaN(quantities[pro._id])}
                                                            // onClick={handleAddToCart}
                                                            >
                                                            Add to cart
                                                            </button>
                                                        </div>
        
                                                    </div>
                                                    </>
                                                ))}
                                                    </div>
                                                    <Pagination className="pagination-pro"
                                                    current={relatedCurrentPage[index] || 1}
                                                    pageSize={relatedPageSize}
                                                    total={group.products.length}
                                                    onChange={(page) => handleRelatedPageChange(page, index)}
                                                    showSizeChanger={false}
                                                    />
                                                </div>
                        
                        </div>
                                            )
                                        ))}

                    </div>
                </div>
            </div>

        </div>
        <Footer />
        
        </>
    );
}

export default Homepage;