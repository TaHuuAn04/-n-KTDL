import Footer from "./components/Footer";
import Headerall from "./components/Headerall";
import "./UserInforStyle.css";
import { PiUserCircleFill } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Userinfor () {

    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const isFirstRender = useRef(true);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    // Xử lý lỗi khi alert nhiều lần
                    if (isFirstRender.current) {
                        alert("Vui lòng đăng nhập để xác thực!");
                        isFirstRender.current = false;
                        navigate("/Login");
                    }
                    return;
                }


                const decodedToken = jwtDecode(token);
                const custID = decodedToken.custID;

                const response = await axios.get(`http://localhost:3000/customers/search?custID=${custID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setUserInfo(response.data.customer);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
                alert('Đã xảy ra lỗi!');
            }
        };

        fetchCustomerData();
    }, []);


    return (
        <>
        <Headerall />

        <div className="user-infor-main">
            <div className="backgr-user-infor">
                <div className="user-infor-wrapper">
                    <div className="user-pro">
                        <PiUserCircleFill className="user-image"/>
                        <div className="user-name">
                            {userInfo && (
                                <li>{userInfo["First Name"]} {userInfo["Last Name"]}</li>
                            )}
                        </div>
                    </div>
                    <div className="userinfor-detail">
                        <div className="user-profile-edit">
                            <Link to="/change_password">
                            <button type="changepw">Change PW</button>
                            </Link>

                            <Link to="/Update_Information">
                            <button type="update">Update</button>
                            </Link>
                        </div>
                        <p>Address</p>
                        <div className="user-address">
                            <div className="address-title">
                                <p>Company</p>
                                <p>City</p>
                                <p>Country</p>
                            </div>
                            <div className="address-detail">
                                {userInfo && (
                                    <>
                                        <ul>{userInfo.Company}</ul>
                                        <ul>{userInfo.City}</ul>
                                        <ul>{userInfo.Country}</ul>
                                    </>
                                )}
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
                                {userInfo && (
                                    <>
                                        <ul>{userInfo.Email}</ul>
                                        <ul>{userInfo["Phone 1"]}</ul>
                                        <ul>{userInfo["Phone 2"]}</ul>
                                    </>
                                )}
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