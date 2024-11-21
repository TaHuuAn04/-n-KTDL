import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./OrderManagementStyle.css";

function ViewPurchaseHistory () {
    return (
        <>
        <Headerall />

        <div className="management-main">
            <div className="backgr-management">
                <div className="topay-wrap">
                    <ul className="ordermanagement-text">VIEW PURCHASE HISTORY</ul>
                    <div className="date-time-management">21/10/2014</div>
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
                            <a  className="buy-again-management">Cancelled</a>
                            <Link to="/Order_Detail"  className="view-more-completed">View more</Link>
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
    );
}

export default ViewPurchaseHistory;