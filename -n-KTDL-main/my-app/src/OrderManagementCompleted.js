import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./OrderManagementStyle.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function OrderManagementCompleted () {
    const [sales, setSales] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit] = useState(5);
    const isFirstRender = useRef(true);
    const navigate = useNavigate();
    const [productNames, setProductNames] = useState({});

    const fetchSalesData = async (page) => {
        try {
            const token = sessionStorage.getItem("token");
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

            const response = await axios.get("http://localhost:3000/orders/filter", {
                params: {
                    customerId: custID,
                    status: "Delivered",
                    page: page,
                    limit: limit,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSales(response.data.sale);
            setTotalPages(Math.ceil(response.data.totalCount / limit));
            fetchProductNames(response.data.sale);
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
            alert("Đã xảy ra lỗi!");
            alert("Vui lòng đăng nhập lại để xác thực!");
            navigate("/Login");
        }
    };

    const fetchProductNames = async (sales) => {
        try {
            const productRequests = sales.map((sale) =>
                axios.get(`http://localhost:3000/products/id/${sale.SKU}`)
            );

            const responses = await Promise.all(productRequests);
            const names = {};

            responses.forEach((response, index) => {
                if (response.data.product) {
                    names[sales[index].SKU] = response.data.product.Name;
                } else {
                    names[sales[index].SKU] = "Không tìm thấy tên sản phẩm";
                }
            });

            setProductNames(names);
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
        }
    };

    
    useEffect(() => {
        fetchSalesData(page);
    }, [page]);

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <>
            <Headerall />

            <div className="management-main">
                <div className="backgr-management">
                    <div className="topay-wrap">
                        <ul className="ordermanagement-text">ORDER MANAGEMENT</ul>
                        <div className="management-navbar">
                            <Link to="/Order_Management/ToPay">Processing</Link>
                            <Link to="/Order_Management/ToShip">To ship</Link>
                            <Link to="/Order_Management/Completed" className="navbar-completed" >Completed</Link>
                            <Link to="/Order_Management/Cancelled">Cancelled</Link>
                        </div>

                        {sales ? (
                            sales.map((sale) => (
                                <div key={sale._id}>
                                    <p className="order-id-text">Order ID: {sale["Order ID"]}</p>
                                    <div className="manage-topay-backgr">
                                        <div className="manage-topay">
                                            <div className="product-title-management">
                                                <div className="product-management"><p>Product</p></div>
                                                <div className="product-management-right">
                                                    <p>Category</p>
                                                    <p>Size</p>
                                                    <p>Quantity</p>
                                                    <p>Cost</p>
                                                </div>
                                            </div>
                                            <div key={sale._id}>
                                                <div key={sale.SKU} className="product-detail-management-main">
                                                    <div className="product-management-detail">
                                                        <p>{productNames[sale.SKU] || "Unknown..."}</p>
                                                        <p>Date: {sale.Date}</p>
                                                        <p>Ship to city: {sale["ship-city"]}</p>
                                                    </div>
                                                    <div className="product-management-detail-right">
                                                        <p className="text-upper">{sale.Category}</p>
                                                        <p className="text-size-order">{sale.Size}</p>
                                                        <p className="qty-text">{sale.Qty}</p>
                                                        <p className="amount-text">{sale.Amount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="button-management">
                                                <div className="management-order-button">
                                                    {/* <Link to="/Homepage" className="cancel-management">Cancel</Link> */}
                                                </div>
                                                <div className="total-management">Total: {sale.Amount}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{justifySelf: "center", fontSize: "25px", padding: "80px"}}>Bạn không có đơn hàng đã giao thành công!</p>
                        )}

                        <div className="pagination pagi-order" style={{fontSize: "20px"}}>
                            <button onClick={goToPreviousPage} disabled={page === 1}>
                                Previous
                            </button>
                            <span>Page {page} / {totalPages || 0}</span>
                            <button onClick={goToNextPage} disabled={page === totalPages || !totalPages}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default OrderManagementCompleted;
