import "./Manage_Order.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import "./OrderManagementStyle.css";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Manage_Order_Returned () {

    const { userInfo } = useAuth(); 
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});

    useEffect(() => {
        const fetchDeliveredOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/getOrder_Cancelled', {
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


    const handleReturn = async (SKU) => {
        try {
            const response = await fetch('http://localhost:3001/updateOrderStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SKU: SKU,
                    Status: 'Returned'
                }),
            });
            const data = await response.json();
            if (data.success) {
                // Cập nhật trạng thái đơn hàng trong state
                setOrders(prevOrders => prevOrders.map(orderGroup => ({
                    ...orderGroup,
                    orders: orderGroup.orders.map(order =>
                        order.SKU === SKU ? { ...order, Status: 'Returned' } : order
                    )
                })));
                alert('Sản phẩm đã được tạo đơn hàng với trạng thái Returned!');
            } else {
                alert('Sản phẩm đã được tạo đơn hàng với trạng thái Returned!');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const navigate = useNavigate();

    const handleUndo = () => {
        navigate('/Management_Order');
    };


    return (

        <>
        <Headerall />

        <div className="management-main">
            <div className="backgr-management">
            <div className="title-of">RETURN ORDER</div>
                <div className="fol-details">
                    <p>Nếu quý khách muốn được giao lại sản phẩm nào trong đơn hàng đã bị hủy bỏ trước đó thì hãy Click vào nút <b>Returned</b></p>
                </div>
                <div className="topay-wrap">
                    
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
                            <div className="button-return-order">
                            <button onClick={() => handleReturn(order.SKU)}>Returned</button>
                            </div>
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
                                
                                
                            </div>
                            <div className="total-management">Total: {orderGroup.orders.reduce((groupTotal, order) => groupTotal + order.Amount, 0)}</div>
                        </div>
                </div>
                </div>
                    </div>
                    </>
                    ))}
                </div>
                <div className="undo-page">
                <button onClick={handleUndo}>Cancel</button>
                </div>
            </div>
        </div>

        <Footer />
        </>
    );
}

export default Manage_Order_Returned;