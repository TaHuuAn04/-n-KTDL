import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import "./CreateAccStyle.css";
import { useNavigate } from "react-router-dom";


function CreateAcc() {

    const [Email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('Nam');
    const [formattedDate, setFormattedDate] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const currentDate = new Date();
        const formatted = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        setFormattedDate(formatted);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

       
        const customerData = {
            Email,
            Password: password,
            FirstName: firstName,
            LastName: lastName,
            Company: company,
            City: city,
            Country: country,
            Phone1: phone1,
            Phone2: phone2,
            Age: age,
            Sex: sex,
            SubscriptionDate: formattedDate,  
        };

        try {
            const response = await axios.post('http://localhost:3000/customers/add', customerData);

            if (response.status === 201) {
                alert('Tạo tài khoản thành công');
                navigate("/Login");
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            if(error.response.status === 500) {
                alert("Đã xảy ra lỗi!");
            }
        }
    };


  return (
    <>
    <Headerall />
    <div className="register-main">
        <div className="backgr-register">
            <div className="reg-wrapper">
                <div className="box-register">
        <form onSubmit={handleSubmit}>
                    <div style={{paddingBottom: "30px"}} className="text-login"><p>CREATE ACCOUNT</p></div>
                    <nav>
                    <h6>Thông tin đăng nhập:</h6>
            <div className="input-register">
                <p>Enter your email</p>
                <input type="text" required
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Password</p>
                <input type="password"  required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
                    </nav>
                    <h6>Thông tin liên hệ:</h6>
            <div className="input-register">
                <p>First Name</p>
                <input type="text"  required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Last Name</p>
                <input type="text"  required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Company</p>
                <input type="text"
                placeholder="Không bắt buộc"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>City</p>
                <input type="text"  required 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Country</p>
                <input type="text"  required 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Phone 1</p>
                <input type="text"  required 
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                />
            </div>
            <div className="input-register">
                <p>Phone 2</p>
                <input type="text"
                placeholder="Không bắt buộc"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                />
            </div>
            


            <div className="input-register">
                <p>Age</p>
                <input type="number" required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                />
            </div>


            <div className="input-register-s">
                <span>Gender</span>
            <select className="option-gender"
                value={sex} 
                onChange={(e) => setSex(e.target.value)} 
                required>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </select>
            </div>

            <div className="input-register">
                <p>Subscription Date</p>
                <input type="text"
                value={formattedDate}
                disabled
                />
            </div>


            <div className="register-button">
            <button type="submit">CREATE</button>
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

export default CreateAcc;
