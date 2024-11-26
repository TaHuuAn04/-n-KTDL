import Headerall from "./components/Headerall";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import "./CreateAccStyle.css";
import { useNavigate } from "react-router-dom";


function CreateAcc() {
    

    const [Email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [City, setCity] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [company, setCompany] = useState("");
    const [country, setCountry] = useState();
    const [phone1, setPhone1] = useState();
    const [phone2, setPhone2] = useState("");
    const [formattedDate, setFormattedDate] = useState();
    const navigate = useNavigate();
    const [customerMaxCustID, setCustomerMaxCustID] = useState();

    
    useEffect(() => {
        const currentDate = new Date();
        const formatted = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        setFormattedDate(formatted);
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3001/getCustomer_MaxCustID")
        .then(customerMaxCustID => setCustomerMaxCustID(customerMaxCustID.data))
        .catch(err => console.log(err))
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Kiểm tra email đã tồn tại chưa
        axios.post("http://localhost:3001/check-email", { email: Email })
            .then(response => {
                if (response.data.message === "Email chưa tồn tại") {
                    const custID = customerMaxCustID["Cust ID"] + 1;
    
                    axios.post("http://localhost:3001/Create_Account", {
                        "Email": Email,
                        "password": password,
                        "First Name": firstName,
                        "Last Name": lastName,
                        "Company": company,
                        "City": City,
                        "Country": country,
                        "Phone 1": phone1,
                        "Phone 2": phone2,
                        "Subscription Date": formattedDate,
                        "Cust ID": custID
                    })
                    .then(result => {
                        console.log(result);
                        navigate('/Homepage');
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => {
                // Nếu email đã tồn tại, in ra thông báo
                alert("Email đã tồn tại, vui lòng nhập Email khác!");
            });
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
                value={City}
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
