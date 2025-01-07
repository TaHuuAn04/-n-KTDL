import "./login.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";



function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/customer/login", {
        username: email,
        password: password,
      });
      if (response.data.token && response.status === 200) {
        sessionStorage.setItem("token", response.data.token);
        navigate("/Homepage");
      }
    //   else {
    //     alert("Đăng nhập thất bại!");
    //   }
    } catch (error) {
      if(error.response) {
        if(error.response.status === 404) {
            alert("Khách hàng không tồn tại!");
        }
        else if(error.response.status === 401) {
            alert("Sai mật khẩu!");
        }
        else if(error.response.status === 500) {
            alert("Đã có lỗi xảy ra, vui lòng thử lại!");
        }
      }
      else {
        alert("Đã xảy ra lỗi không xác định, vui lòng kiểm tra kết nối và thử lại!");
      }
    }
  };


  return (
    <>
    <Headerall />
    <div className="login-main">
        <div className="backgr">
            <div className="wrapper">
                <div className="box-login boder">
                <form onSubmit={handleSubmit}>
                    <div className="text-login"><p>LOGIN TO YOUR ACCOUNT</p></div>
            <div className="input-box">
                <p>Enter your email</p>
                <input type="text" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               
                />
            </div>
            <div className="input-box">
                <p>Password</p>
                <input type="password"  required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="account">
                
                <Link to="/Create_Account" >Create account</Link>
            </div>

            <button 
                type="submit"
                className="boder my-button-login"
            ><p>LOGIN</p></button>
        </form>
       
                </div>
            </div>
        </div>
    </div>
    <Footer />
    </>
  );
}

export default Login;
