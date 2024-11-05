import "./login.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import { useState } from "react";
import { loginUser } from "./redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// const connectDB = require('../db.js')



function Login() {

    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    
    // const handleLogin = (e) => {
    //     e.preventDefault();

    //     const usernew = {
    //         email: email,
    //         password: password,
    //     };
    //     loginUser(usernew, dispatch, navigate);
    // };

  return (
    <>
    <Headerall />
    <div className="login-main">
        <div className="backgr">
            <div className="wrapper">
                <div className="box-login boder">
                <form >
                    <div className="text-login"><p>LOGIN TO YOUR ACCOUNT</p></div>
            <div className="input-box">
                <p>Enter your email</p>
                <input type="text" required
                // onChange={(e)=>setEmail(e.target.value)} 
                />
            </div>
            <div className="input-box">
                <p>Password</p>
                <input type="password"  required
                // onChange={(e)=>setPassword(e.target.value)}
                />
            </div>

            <div className="account">
                <a href="#">Forgot password</a>
                <a href="#" target="_blank">Create account</a>
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
