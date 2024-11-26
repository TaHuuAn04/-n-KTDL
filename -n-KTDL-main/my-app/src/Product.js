import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./ProductStyle.css";
import { PiUserCircleFill } from "react-icons/pi";

function Product () {
    return (
        <>
        <Headerall />

        <div className="product-main">
            <div className="backgr-product">
                <div className="product-wrapper">
                    <ul>1 2 3 4 5 6 7</ul>
                    <div className="buy-product">
                        <div className="product-detail">
                            <div className="order-product">
                                <PiUserCircleFill className="image-product" />
                                <div className="product-infor">
                                    <div className="product-text">
                                        Plus Size Indian Pakistani Kurti for Womens With Dupatta | Art Silk Woven Kurta Kurtis Dress For Women
                                    </div>
                                        
                                        <form>
                                            <div className="choose-product-backgr">
                                                <span>Size</span>
                                                <div className="choose-size">
                                                    <ul><input type="checkbox"></input><p className="size-M">M</p></ul>
                                                    <ul><input type="checkbox"></input><p className="size-L">L</p></ul>
                                                    <ul><input type="checkbox"></input><p className="size-XL">XL</p></ul>
                                                    <ul><input type="checkbox"></input><p className="size-XXL">XXL</p></ul>
                                                </div>
                                                <span>Color</span>
                                                <div className="choose-color">
                                                    <ul><input type="checkbox"></input><p className="color-green">Green</p></ul>
                                                    <ul><input type="checkbox"></input><p className="color-pink">Pink</p></ul>
                                                </div>
                                                <ul>Quantity <input type="text" placeholder="1" className="choose-quantity"></input></ul>
                                                <ul>Cost: <div className="cost-chosen">25,00</div> </ul>
                                            </div>
                                            <button type="submit" className="button-buy-product">BUY</button>
                                        </form>

                                </div>
                            </div>
                            
                        </div>
                        <div className="product-orthers">
                            Tui sẽ thêm mấy cái checkbox vô sau nha.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
        </>
    );
}

export default Product;