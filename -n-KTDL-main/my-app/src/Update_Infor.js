import "./Update_Infor.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import "./CreateAccStyle.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";



function Update_Infor () {

    
    
    const [City, setCity] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [Company, setCompany] = useState("");
    const [Country, setCountry] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    

    
    const { userInfo } = useAuth(); // Lấy thông tin người dùng từ AuthContext
    const [password, setPassword] = useState(""); // State để lưu thông tin City mới
    const navigate = useNavigate(); // Dùng để điều hướng sau khi cập nhật thành công

    useEffect(() => {
        if (userInfo && userInfo.custID) {
            // Nếu người dùng đã đăng nhập, có Cust ID, chúng ta có thể load thông tin City
            
            fetch(`http://localhost:3001/getUser/${userInfo.custID}`)
                .then((response) => response.json())
                .then((data) => {
                    setPassword(data.password || "");
                    setFirstName(data["First Name"] || "");
                    setLastName(data["Last Name"] || "");
                    setCompany(data.Company || "");
                    setCity(data.City || "");
                    setCountry(data.Country || "");
                    setPhone1(data["Phone 1"] || "");
                    setPhone2(data["Phone 2"] || "");
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [userInfo]);

    // Hàm cập nhật City vào cơ sở dữ liệu
    const updateCity = () => {
        if (!userInfo || !userInfo.custID) {
            alert("User not logged in!");
            return;
        }

        fetch("http://localhost:3001/updateUser_Infor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                "Cust ID": userInfo.custID, // Dùng Cust ID từ AuthContext
                password: password,
                "First Name": firstName,
                "Last Name": lastName,
                Company: Company,
                City: City,
                Country: Country,
                "Phone 1": phone1,
                "Phone 2": phone2,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Update successful:", data);
                alert("Thông tin đã được cập nhật thành công!")
                navigate("/Manage_Personal_Information"); // Điều hướng đến trang chủ sau khi cập nhật thành công
            })
            .catch((error) => {
                console.error("Error updating city:", error);
            });
    };


    return (
        <>
    <Headerall />
    <div className="register-main">
        <div className="backgr-register">
            <div className="reg-wrapper">
                <div className="box-register">
        <div >
                    <div style={{paddingBottom: "30px"}} className="text-login"><p>UPDATE INFORMATION</p></div>
                    
                    <h7 className="Update_infor_text">Thông tin liên hệ:</h7>
            <div className="input-register">
                <p>First Name</p>
                <input 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Last Name</p>
                <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Company</p>
                <input 
                
                value={Company}
                onChange={(e) => setCompany(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>City</p>
                <input 
                value={City}
                onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Country</p>
                <input 
                value={Country}
                onChange={(e) => setCountry(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Phone 1</p>
                <input 
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Phone 2</p>
                <input 
                
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                />
            </div>
           

            <div className="register-button">
            <button
            onClick={updateCity}
            >UPDATE</button>
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

export default Update_Infor;