import "./Management_Order_Style.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";


function Management_Order () {

    return (
        <>
        <Headerall />
        <div className="back-gr-wrap">

        <div className="title-or-ma">
        <h>ORDER MANAGEMENT</h>
        </div>

        <div className="detail-fol">
        <p>Chọn vào nút <b>Cancel Order</b> nếu quý khách muốn hủy bỏ những 
        sản phẩm đang được tiến hành giao đến cho quý khách. Chọn vào nút <b>Return Order</b> nếu quý khách muốn giao lại
         những sản phẩm mà quý khách đã hủy trước đó. </p> 
        </div>


        <div className="two-button">
            <nav> <Link to="/Manage_Order_Cancelled">Cancel Order</Link> </nav>
            <span> <Link to="/Manage_Order_Returned">Return Order</Link> </span>
        </div>

        </div>

        <Footer />
        </>
    );
}

export default Management_Order;