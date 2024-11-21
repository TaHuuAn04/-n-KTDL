import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./Orderdetailstyle.css";
import "./orderstyle.css";
import "./OrderManagementStyle.css";
import { Link } from "react-router-dom";

function OrderDetail () {
    return (
        <>
        <Headerall />
        <div className="orderdetail-main">
            <div className="backgr-orderdetail">
                <div className="order-detail-wrapper">
                    <div className="order-detail-title">
                        ORDER DETAIL
                    </div>
                    <div className="order-detail-box">
                    <div className="order-add-cons">
                        <div className="add-cons"><b>Address</b></div>
                        <div className="add-cons"><b>Constact</b></div>
                    </div>
                    <div className="order-ship-phone">
                        <ul>Ship City: <li>Sangli miraj kupwad</li></ul>
                        <ul>Phone Number: <li>2311188763</li></ul>
                    </div>
                    <div className="order-ship-email">
                        <ul>Ship State: <li>Maharashtra</li></ul>
                        <ul>Email: <li>tranvana@gmail.com</li></ul>
                    </div>
                    </div>
                    <div className="manage-topay-backgr backgr-order-edit">
                    <div className="manage-topay">
                        <div className="product-title-management">
                                <div className="product-management"><p><b>Product</b></p></div>
                                <div className="product-management-right">
                                    <p><b>Catagory</b></p>
                                    <p><b>Size</b></p>
                                    <p><b>Size</b></p>
                                    <p><b>Cost</b></p>
                                </div>
                        </div>
                        <div className="product-detail-management-main">
                                <div className="product-management-detail"><p>Plus Size Indian Pakistani Kurti for Womens With Dupatta | Art Silk Woven Kurta Kurtis Dress For Women</p></div>
                                <div className="product-management-detail-right">
                                        <p>KURTA</p>
                                        <p>XL</p>
                                        <p>2</p>
                                        <p>65.00</p>
                                </div>
                        </div>
                        <div className="button-management">
                            <div className="management-order-button detail-button-order">
                                <Link to="/Product" className="buy-again-management button-canceled button-buy-again-detail">Buy again</Link>
                                <Link to="/Order_Management_ToPay" className="view-more-completed button-canceled">Canceled</Link>
                            </div>
                            <div className="total-management">Total: 65,00</div>
                        </div>
                    </div>
                    </div>
                    </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default OrderDetail;