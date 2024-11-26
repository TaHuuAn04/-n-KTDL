import { useAuth } from "./AuthContext";
import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./UserInforStyle.css";
import { PiUserCircleFill } from "react-icons/pi";
import { Link } from "react-router-dom";

function Userinfor () {

    const { userInfo } = useAuth();



    return (
        <>
        <Headerall />

        <div className="user-infor-main">
            <div className="backgr-user-infor">
                <div className="user-infor-wrapper">
                    <div className="user-pro">
                        <PiUserCircleFill className="user-image"/>
                        <div className="user-name">
                            <li>{userInfo.name}</li>
                        </div>
                    </div>
                    <div className="userinfor-detail">
                        <div className="user-profile-edit">
                            <Link to="/change_password">
                            <button type="changepw">Change PW</button>
                            </Link>
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
                                <ul>{userInfo.company}</ul>
                                <ul>{userInfo.city}</ul>
                                <ul>{userInfo.country}</ul>
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
                                <ul>{userInfo.email}</ul>
                                <ul>{userInfo.phone1}</ul>
                                <ul>{userInfo.phone2}</ul>
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