import "./orderstyle.css"
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import "./OrderManagementStyle.css";
import { Link } from "react-router-dom";

function Order () {
    return (
        <>
        <Headerall />
        <div className="order-main">
            <div className="background">
                <div className="inner-wrapper">
                    <div className="order-text-title">
                        <p>ORDER</p>
                    </div>
                    <div className="add-text">
                        <p>Address</p>
                    </div>
                    <div className="ship">
                        <div className="text-infor name-ship">Ship city</div>
                        <div className="order-text text-detail">SANGLI MIRAJ KUPWAD</div>
                        <div className="text-infor name-ship">Ship state</div>
                        <div className="order-text text-detail">MAHARASHTRA</div>
                    </div>
                    <div className="constact-customer">
                        <div className="text-infor name-ship">Phone number</div>
                        <div className="order-text text-detail">031555558915</div>
                        <div className="text-infor name-ship">Email</div>
                        <div className="order-text text-detail">tranvana@gmail.com</div>
                    </div>
                    <div className="manage-topay-backgr-order">
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
                            <div className="management-order-button">
                                <button className="order-button">Order</button>
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

export default Order;