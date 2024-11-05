import "./login.css";
import Headerall from "./components/Headerall";
import Footer from "./components/Footer";


function CreateAcc() {
    const handleClick = (e) => {
        console.log(e.target);
    }
  return (
    <>
    <Headerall />
    <div className="login-main">
        <div className="backgr">
            <div className="wrapper">
                <div className="box-login boder">
                <form action="">
                    <div className="text-login"><p>CREATE ACCOUNT</p></div>
            <div className="input-box">
                <p>Enter your email</p>
                <input type="text" required />
            </div>
            <div className="input-box">
                <p>Password</p>
                <input type="password"  required />
            </div>

            <button type="submit" onClick={handleClick} className="boder my-button-create"><p>CREATE</p></button>
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
