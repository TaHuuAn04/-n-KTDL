import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function ChangePassword() {
    
    const [userInfoState, setUserInfoState] = useState({
        FirstName: '',
        LastName: '',
        company: '',
        city: '',
        country: '',
        phone1: '',
        phone2: '',
        Email: '',
        SubscriptionDate: '',
        Password: ''
    });

    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const decodedToken = jwtDecode(token);
    const custID = decodedToken.custID;


    useEffect(() => {
        axios.get(`http://localhost:3000/customers/search?custID=${custID}`)
            .then(response => {
                setUserInfoState(response.data.customer);
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi tải thông tin khách hàng", error);
            });
    }, [custID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfoState({
            ...userInfoState,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.patch(`http://localhost:3000/customers/update/${userInfoState._id}`, userInfoState)
            .then(response => {
                alert(response.data.message);
                navigate("/Manage_Personal_Information");
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi cập nhật thông tin khách hàng", error);
                alert("Cập nhật thông tin thất bại!");
            });
    };

    return (
        <>
        <Headerall />
        <div className="register-main">
            <div className="backgr-register">
                <div className="reg-wrapper">
                    <div className="box-register">
            <form onSubmit={handleSubmit} >
                        <div style={{paddingBottom: "30px"}} className="text-login"><p>CHANGE PASSWORD</p></div>
                        
                        
                <div className="input-register">
                    <p>Your Name</p>
                    <input
                    className="input-field" 
                    disabled
                    placeholder={`${userInfoState["First Name"]} ${userInfoState["Last Name"]}`}
                    />
                </div>
                <div className="input-register">
                    <p>Your Email</p>
                    <input
                    className="input-field"
                    placeholder={userInfoState["Email"]}
                    disabled
                    />
                </div>
                <div className="input-register">
                    <p>Enter Your New Password</p>
                    <input 
                    type="password"
                    name="Password" value={userInfoState.Password} onChange={handleChange}
                    />
                </div>
    
                <div className="register-button">
                <button
                type="submit"
                >UPDATE</button>
                </div>
            </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default ChangePassword;
