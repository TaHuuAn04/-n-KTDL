import "./login.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import { loginUser } from "./redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Password from "antd/es/input/Password";
import axios from "axios";
// const connectDB = require('../db.js')



function Login() {

    // const { handleLogin } = useAuth();
    // const { setLoggedIn } = useAuth();
    // const navigate = useNavigate();
    // const [formData, setFormData] = useState({ Email: '', password: ''});
    // const [Email, setEmail] = useState();
    // const [err, setErr] = useState();

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    // // const handleSubmit = async (e) => {
    // //     e.preventDefault();

    // //     const { username, password } = formData;

    // //     try {
    // //         const response = await axios.post("http://localhost:3001/login", {username, password});

    // //         if(response.status === 200) {
    // //             const { user, role } = response.data;
    // //         }

    // //         handleLogin(username, role);
    // //         localStorage.setItem('isLoggedIn', 'true');
    // //         localStorage.setItem('userData', JSON.stringify(user));
    // //         navigate("/");
    // //     }
    // //     catch (err) {
    // //         SetError(err.response?.data?.message || "Đăng nhập không thành công!");
    // //     }
    // // };

    // const handleLoginRequest = async (apiEndPoint) => {
    //     try {
    //         const response = await axios.post(apiEndPoint, formData);
    //         console.log(response.data);
    //         if (response.status === 200) {
    //             // handleLogin(formData, isAdmin);
    //             localStorage.setItem('isLoggedIn', 'true');
    //             // localStorage.setItem('isAdmin', 'true' );
    //             navigate('/');
    //         }
    //     } catch (error) {
    //         console.error('Đã có lỗi xảy ra', error);
    //     }
    // };

    // // const handleSubmit = (e) => {
    // //     e.preventDefault();
    // //     // const isAdmin = document.getElementById('isAdmin').checked;
    // //     //Thực hiện kiểm tra thông tin đăng nhập, ví dụ: tạm thời kiểm tra username và password là "admin"
    // //     axios.post("http:localhost:3001/login-test", {username: Email})
    // //     // if (formData.username === 'admin' && formData.password === 'admin') {
    // //     //     // Đăng nhập thành công, chuyển hướng đến trang dashboard
    // //     //     navigate('/');
    // //     // } 
    // //     .then(response => {
    // //         if(response.data.message === "Đăng nhập thành công!") {
    // //             navigate("/")
    // //         }
    // //     })
    // //     // else {
    // //     //     // Đăng nhập không thành công, xử lý tại đây (ví dụ: hiển thị thông báo lỗi)
    // //     //     alert('Bạn nhập sai Tài khoản hoặc Mật khẩu');
    // //     // }

    // //     //handleLoginRequest('http://localhost:4001/api/login', isAdmin);
    // //     .catch(err => {
    // //         alert("Sai!!!")
    // //     });
    // // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
        
    //     // Check that formData is valid (optional)
    //     if (!formData.Email || !formData.password) {
    //         setErr("Both email and password are required.");
    //         return;
    //     }

    //     // API request for login
    //     axios.post("http://localhost:3001/login-test-a", { username: formData.Email })
    //         .then(response => {
    //             if (response.data.message === "Đăng nhập thành công!") {
    //                 localStorage.setItem('isLoggedIn', 'true');
    //                 navigate("/");
    //             }
    //         })
    //         .catch(err => {
    //             setErr("Sai Tài khoản hoặc Mật khẩu");
    //         });
    // };

    // useEffect(() => {
    //     const isLoggedIn = localStorage.getItem('isLoggedIn');
    //     if (isLoggedIn === 'true') {
    //         setLoggedIn(true);
    //     }
    // }, [setLoggedIn]);

    const { handleLogin } = useAuth();  // Lấy hàm handleLogin từ AuthContext
    const navigate = useNavigate();

    // State để lưu giá trị của form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Gửi yêu cầu đến API đăng nhập, sử dụng tên trường 'Email' trong body của request
            const response = await axios.post("http://localhost:3001/login-test", {
                Email: email,  // Chắc chắn trường 'Email' ở đây phải trùng với tên trường trong database
                password: password,
            });

            // Lưu thông tin người dùng vào AuthContext và localStorage
            const userData = response.data.user;
            // Gọi API để lấy thông tin đơn hàng
        // const ordersResponse = await axios.get("http://localhost:3001/getOrdersByCustomerId", {
        //     params: { custId: userData["Cust ID"] }
        // });

        // const userOrders = ordersResponse.data;

        // Lưu thông tin người dùng và đơn hàng vào AuthContext
        handleLogin(userData);
            // handleLogin(userData);

            // Chuyển hướng đến trang chính sau khi đăng nhập thành công
            navigate("/Homepage");  // Chuyển hướng tới trang khác sau khi đăng nhập thành công

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setError(error.response ? error.response.data.message : "Lỗi server");
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
                <a href="#">Forgot password</a>
                <Link to="/Create_Account" >Create account</Link>
            </div>

            <button 
                type="submit"
                className="boder my-button-login"
            ><p>LOGIN</p></button>
        </form>
        {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    </div>
    <Footer />
    </>
  );
}

export default Login;
