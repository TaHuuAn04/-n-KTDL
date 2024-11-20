import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../App.css';

const Login = () => {
    const { handleLogin } = useAuth();
    const { setLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(''); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isAdmin = document.getElementById('isAdmin').checked;

        try {
            const response = await axios.post('http://localhost:3000/api/login', formData);

            if (response.status === 200) {
                const { user, isAdmin } = response.data;

                
                handleLogin(user, isAdmin);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');

                
                if (isAdmin) {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            // Xử lý lỗi trả về từ server
            if (error.response) {
                setError(error.response.data.message || 'Đăng nhập không thành công!');
            } else {
                // Lỗi server không phản hồi -> chạy node Backend/index.js 
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau!');
            }
        }
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            setLoggedIn(true);
        }
    }, [setLoggedIn]);

    return (
        <div className="login-page">
            <div className="login-logo-wrapper">
                <span className="UnifrakturCook Bold">Closet</span>
            </div>
            <p style={{ marginLeft: '156px', fontSize: '18px', fontStyle: 'italic', color: '#592A1C' }}>
                Chào mừng bạn quay trở lại với <span className="UnifrakturCook Bold">Closet</span> !
            </p>
            <div className="login-form">
                <h1>Đăng nhập</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="login-label">Username</label>
                        <input
                            className="login-input"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="login-label">Password</label>
                        <input
                            className="login-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '8px' }} className="isAdminCheck">
                        <input type="checkbox" id="isAdmin"></input>
                        <label htmlFor="isAdmin">
                            Bạn là Admin của <span className="UnifrakturCook Bold">Closet</span>?
                        </label>
                    </div>
                    <button className="login-btn" type="submit">
                        Đăng nhập
                    </button>
                </form>
            </div>
            <img className="img-logo" src="src/assets/Group 2.png" alt="Closet Logo"></img>
        </div>
    );
};

export default Login;
