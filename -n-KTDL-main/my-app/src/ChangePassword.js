import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import "./login.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";


function ChangePassword() {
    

    const { userInfo } = useAuth(); // Lấy thông tin người dùng từ AuthContext
    const [password, setPassword] = useState(""); // State để lưu thông tin City mới
    const navigate = useNavigate(); // Dùng để điều hướng sau khi cập nhật thành công

    useEffect(() => {
        if (userInfo && userInfo.custID) {
            // Nếu người dùng đã đăng nhập, có Cust ID, chúng ta có thể load thông tin City
            
            fetch(`http://localhost:3001/getUser/${userInfo.custID}`)
                .then((response) => response.json())
                .then((data) => {
                    setPassword(data.password || ""); // Giả sử API trả về dữ liệu có trường 'City'
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

        fetch("http://localhost:3001/updateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                "Cust ID": userInfo.custID, // Dùng Cust ID từ AuthContext
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Update successful:", data);
                alert("Mật khẩu đã được thay đổi thành công!")
                navigate("/Homepage"); // Điều hướng đến trang chủ sau khi cập nhật thành công
            })
            .catch((error) => {
                console.error("Error updating city:", error);
            });
    };

    return (
        <div>
            {/* <h1>Change Password</h1>
            City<br />
            <input value={City}  onChange={(e) => setCity(e.target.value)} /> <br />
            Email <br />
            <input placeholder="email" disabled/><br />
            <button onClick={updateCity}> Update Details </button>
            <p>{userInfo.custID}</p> */}

            <Headerall />

            <div className="login-main">
        <div className="backgr">
            <div className="wrapper">
                <div className="box-login boder">
                <div >
                    <div className="text-login" style={{paddingTop: "60px"}}><p>CHANGE PASSWORD</p></div>
                    <div className="input-box" style={{marginBottom: "20px"}}>
                <p>Your Name:</p>
                <input type="text" 
                disabled
                defaultValue={userInfo.name}
               
                />
            </div>
            <div className="input-box" style={{marginBottom: "20px"}}>
                <p>Your Email:</p>
                <input type="text" 
                disabled
                defaultValue={userInfo.email}
               
                />
            </div>
            <div className="input-box">
                <p>Enter your new password</p> 
                <input 
                // type="text" 
                // required
                
                value={password}  
                onChange={(e) => setPassword(e.target.value)}
                style={{marginBottom: "20px"}}
                />
            </div>
            

            

            <button 
                onClick={updateCity}
                className="boder my-button-login"
            ><p>Change</p></button>
        </div>
       
                </div>
            </div>
        </div>
    </div>
<Footer />

        </div>
    );
}

export default ChangePassword;
