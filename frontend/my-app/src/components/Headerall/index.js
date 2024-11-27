import React, { useState } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import "./header-style.css";
import logo from "./logo.png";
import { SlMagnifier } from "react-icons/sl";
import { FaCartShopping } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";


function Headerall() {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

    const handleChange = (e) => {
        console.log(e.target.value);
    }

    const handleClick = (e) => {
        console.log(e.target);
    }
    return (
        <>
        <div className="header-main">
        <div className="header-backgr">
            <div className="inner-wrap">
                <div className="inner-logo">
                    <ul>
                        <li>
                            <button className="my-list" onClick={toggleMenu} ><AiOutlineUnorderedList /></button>
                        </li>
                        <li>
                            <Link to="/">
                                <img src={logo} className="my-img"/>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="inner-search">
                    <input type="text" onChange={handleChange} placeholder="Search" className="my-search"/>
                    <button onClick={handleClick} className="my-button"> <SlMagnifier className="my-magni"/> </button>
                </div>
                <div className="inner-user">
                    <ul>
                        <li>
                            <Link to="/Order">
                                <FaCartShopping className="my-icon-shop"/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Login">
                                <FaCircleUser className="my-icon-user"/>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        {isMenuVisible && (
        <nav className="menu">
          <ul>
            <li><Link to="/Order_Management_ToPay">Order management</Link></li>
            <li><Link to="/Manage_Personal_Information">Manage personal information</Link></li>
            <li><Link to="/LogOut">Log out</Link></li>
          </ul>
        </nav>
        )}
        </>
    )
}

export default Headerall;