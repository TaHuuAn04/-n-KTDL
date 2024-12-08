import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./OrderManagementStyle.css";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import axios from "axios"

function OrderManagementToShip () {



    const { userInfo } = useAuth(); 
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});

    useEffect(() => {
        const fetchDeliveredOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/getOrder_Returned', {
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
                console.error('Error fetching orders:', error);
            }
        };

        if (userInfo.custID) {
            fetchDeliveredOrders();
        }
    }, [userInfo.custID]);




    return (
        <>
        <Headerall />

        <div className="management-main">
            <div className="backgr-management">
                <div className="topay-wrap">
                    <ul className="ordermanagement-text">VIew Purchase History</ul>
                    {/* <Link to="/View_Purchase_History" className="viewpurchasehistory">View Purchase History</Link> */}
                    <div className="management-navbar">
                        <Link to="/Order_Management_ToPay" >Delivered</Link>
                        <Link to="/Order_Management_ToShip"  className="navbar-toship">Returned</Link>
                        <Link to="/Order_Management_Completed" >Refunded</Link>
                        <Link to="/Order_Management_Cancelled" >Cancelled</Link>
                    </div>
                    
                    {orders.map(orderGroup => (
                        <>
                        <p className="order-id-text">Order ID: {orderGroup._id}</p>
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
                <div key={orderGroup._id}>
                   
                    {orderGroup.orders.map(order => (
                        <div key={order.SKU} className="product-detail-management-main" >
                            <div className="product-management-detail">
                                <p>{products[order["SKU Code"]]}</p>
                                <p>Date: {order.Date}</p>
                                <p>Ship to city: {order.ship_city}</p>
                            </div>
                            <div className="product-management-detail-right">
                                <p className="text-upper" >{order.Category}</p>
                                <p className="text-size-order"> {order.Size}</p>
                                <p className="qty-text"> {order.Qty}</p>
                                <p className="amount-text"> {order.Amount}</p>
                            </div>
                            
                        </div>
                    ))}
                    
                        <div className="button-management">
                            <div className="management-order-button">
                                
                                <Link to="/Homepage" className="cancel-management">Cancel</Link>
                            </div>
                            <div className="total-management">Total: {orderGroup.orders.reduce((groupTotal, order) => groupTotal + order.Amount, 0)}</div>
                        </div>
                </div>
                </div>
                    </div>
                    </>
                    ))}
   
                </div>
            </div>
        </div>

        <Footer />
        </>
    );
}

export default OrderManagementToShip;