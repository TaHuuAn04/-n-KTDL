import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./OrderManagementStyle.css";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

function ViewPurchaseHistory () {


    const { userInfo } = useAuth();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3001/getOrder", {
                    params: { custId: userInfo.custID }
                });
                setOrders(response.data);

                const productPromises = response.data.map(order => 
                    axios.get("http://localhost:3001/getProductBySKU", { params: { sku: order.SKU } })
                );
                const productResponses = await Promise.all(productPromises);
                const productData = productResponses.reduce((acc, res) => {
                    acc[res.data.SKU] = res.data.Name;
                    return acc;
                }, {});
                setProducts(productData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        if (userInfo.custID) {
            fetchOrders();
        }
    }, [userInfo.custID]);

    return (
        <>
        <Headerall />

        <div className="management-main">
            <div className="backgr-management">
                <div className="topay-wrap">
                    <ul className="ordermanagement-text">VIEW PURCHASE HISTORY</ul>
                    



                        {orders.map(order => (
                            <>
                                    <div className="date-time-management">{order.Date}</div>
                    <div className="manage-topay-backgr">
                    <div className="manage-topay">
                        <div className="product-title-management">
                                <div className="product-management"><p>Product</p></div>
                                <div className="product-management-right">
                                    <p>Catagory</p>
                                    <p>Size</p>
                                    <p>Quantity</p>
                                    <p>Cost</p>
                                </div>
                        </div>
                                    <div key={order._id} className="product-detail-management-main">
                                        <div className="product-management-detail">
                                            <p>{products[order["SKU Code"]]}</p>
                                        </div>
                                        <div className="product-management-detail-right">
                                            <p className="text-upper">{order.Category}</p>
                                            <p className="text-size-order">{order.Size}</p>
                                            <p className="qty-text">{order.Qty}</p>
                                            <p className="amount-text">{order.Amount}</p>
                                        </div>
                                    </div>
                                    <div className="button-management">
                                    <div className="management-order-button">
                                    <a  className="buy-again-management">{order.Status}</a>
                                    <Link to="/Order_Detail"  className="view-more-completed">View more</Link>
                                    </div>
                                    <div className="total-management">Total: {order.Amount}</div>
                                    </div>
                            </div>
                            </div>
                            </>
                        ))}



                        {/* <div className="product-detail-management-main">
                                <div className="product-management-detail"><p>Plus Size Indian Pakistani Kurti for Womens With Dupatta | Art Silk Woven Kurta Kurtis Dress For Women</p></div>
                                <div className="product-management-detail-right">
                                        <p>KURTA</p>
                                        <p>XL</p>
                                        <p>2</p>
                                        <p>65.00</p>
                                </div>
                        </div>
                        <div className="button-management">
                            <div className="management-order-button">
                            <a  className="buy-again-management">Cancelled</a>
                            <Link to="/Order_Detail"  className="view-more-completed">View more</Link>
                            </div>
                            <div className="total-management">Total: 65,00</div>
                        </div> */}
                    
                </div>
            </div>
        </div>

        <Footer />
        </>
    );
}

export default ViewPurchaseHistory;