import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Headerall from './components/Headerall';
import Footer from './components/Footer';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UpdateUserInfo = () => {

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
                        <div style={{paddingBottom: "30px"}} className="text-login"><p>UPDATE INFORMATION</p></div>
                        
                        <h6 className="Update_infor_text">Thông tin liên hệ:</h6>
                <div className="input-register">
                    <p>First Name</p>
                    <input 
                    name="FirstName"
                    value={userInfoState.FirstName } onChange={handleChange}
                    placeholder={userInfoState["First Name"]}
                    />
                </div>
                <div className="input-register">
                    <p>Last Name</p>
                    <input
                    name="LastName" value={userInfoState.LastName} onChange={handleChange}
                    placeholder={userInfoState["Last Name"]}
                    />
                </div>
                <div className="input-register">
                    <p>Company</p>
                    <input 
                    name="company" value={userInfoState.company} onChange={handleChange}
                    placeholder={userInfoState["Company"]}
                    />
                </div>
                <div className="input-register">
                    <p>City</p>
                    <input 
                    name="city" value={userInfoState.city} onChange={handleChange}
                    placeholder={userInfoState["City"]}
                    />
                </div>
                <div className="input-register">
                    <p>Country</p>
                    <input 
                    name="country" value={userInfoState.country} onChange={handleChange}
                    placeholder={userInfoState["Country"]}
                    />
                </div>
                <div className="input-register">
                    <p>Phone 1</p>
                    <input 
                    name="phone1" value={userInfoState.phone1} onChange={handleChange}
                    placeholder={userInfoState["Phone 1"]}
                    />
                </div>
                <div className="input-register">
                    <p>Phone 2</p>
                    <input 
                    name="phone2" value={userInfoState.phone2} onChange={handleChange}
                    placeholder={userInfoState["Phone 2"]}
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
};

export default UpdateUserInfo;