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
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "antd";

function Homepage () {

    const [productName, setProduct] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    useEffect(() => {
        axios.get("http://localhost:3001/getProduct_Name")
        .then(productName => setProduct(productName.data))
        .catch(err => console.log(err))
      }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = productName.slice(startIndex, startIndex + itemsPerPage);

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
                                <li> <img src={kurta} /> <div className="cata"> <p>KARTA</p> </div> </li>
                                <li> <img src={dress} /> <div className="cata"> <p>DRESS</p> </div> </li>
                                <li> <img src={blouse} /> <div className="cata"> <p>BLOUSE</p> </div> </li>
                                <li> <img src={pants} /> <div className="cata"> <p>PANTS</p> </div> </li>
                                <li> <img src={top} /> <div className="cata"> <p>TOP</p> </div> </li>
                            </div>
                    </div>
                    <div className="product-all">
                        <div className="product-title-homepg"> <p>PRODUCT</p> </div>
                        <div className="product-orthers">
                        <div className="product-search">
                            <div className="search-filter">
                                <p className="product-catagory">CATAGORIES</p>
                                <ul> <input type="checkbox"></input> Kurta </ul>
                                <ul> <input type="checkbox"></input> Dress </ul>
                                <ul> <input type="checkbox"></input> Blouse </ul>
                                <ul> <input type="checkbox"></input> Pants</ul>
                                <ul> <input type="checkbox"></input> Top </ul>
                            </div>
                            <div className="product-filter">
                                <p className="product-catagory filter">FILTER</p>
                                <ul> <input type="checkbox"></input> BEST SELLER </ul>
                                <div className="filter-cost">
                                    <p className="product-cost">COST</p>
                                    <ul> <input type="checkbox"></input> Increase </ul>
                                    <ul> <input type="checkbox"></input> Decrease </ul>
                                </div>
                            </div>
                        </div>
                        <div className="product-bg-homepage">
                                <div className="product-image-detail">
                                    {
                                        currentItems.map(pro => {
                                            return (
                                                <div className="homepg-image-detail">
                                                    {
                                                        <>
                                                        <Link to="/Product"><div className="product-infor-image-homepg"> <img src={product_detail} /> </div></Link>
                                                        <p>65,00$</p>
                                                        <div className="text-product-home-page">{pro.Name}</div>
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
                                    total={productName.length}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
        </>
    );
}

export default Homepage;