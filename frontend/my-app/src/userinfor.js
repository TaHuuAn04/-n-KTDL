import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./UserInforStyle.css";
import { PiUserCircleFill } from "react-icons/pi";

function Userinfor () {
    return (
        <>
        <Headerall />

        <div className="user-infor-main">
            <div className="backgr-user-infor">
                <div className="user-infor-wrapper">
                    <div className="user-pro">
                        <PiUserCircleFill className="user-image"/>
                        <div className="user-name">
                            <li>TRẦN VĂN A</li>
                        </div>
                    </div>
                    <div className="userinfor-detail">
                        <div className="user-profile-edit">
                            <button type="changepw">Change PW</button>
                            <button type="update">Update</button>
                        </div>
                        <p>Address</p>
                        <div className="user-address">
                            <div className="address-title">
                                <p>Company</p>
                                <p>City</p>
                                <p>Country</p>
                            </div>
                            <div className="address-detail">
                                <ul>Horn, Shepard and Watson</ul>
                                <ul>Lake Jeffborough</ul>
                                <ul>Andorra</ul>
                            </div>
                        </div>
                        <p>Constact</p>
                        <div className="user-address">
                            <div className="address-title">
                                <p>Email</p>
                                <p>Phone 1</p>
                                <p>Phone 2</p>
                            </div>
                            <div className="address-detail">
                                <ul>fgill@cline-perkins.com</ul>
                                <ul>408-324-9457</ul>
                                <ul>408-324-9457</ul>
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

export default Userinfor;