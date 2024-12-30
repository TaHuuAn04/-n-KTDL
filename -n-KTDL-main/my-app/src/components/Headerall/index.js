import React, { useState } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import "./header-style.css";
import logo from "./logo.png";
import { SlMagnifier } from "react-icons/sl";
import { FaCartShopping } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext";
import { Menu, Dropdown, Avatar } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';



function Headerall() {
  const navigate = useNavigate();

    const handleChange = (e) => {
        console.log(e.target.value);
    }

    const handleClick = (e) => {
        console.log(e.target);
    }


    const { clearCart } = useCart();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    clearCart();
    navigate("/Login");
  }

  const menu = (
    <Menu className="Menu-avatar">
      <Menu.Item key="1" icon={<LoginOutlined />}>
        <Link to="/Login">Login</Link>
      </Menu.Item>
      
      <Menu.Item key="2" icon={<LogoutOutlined />}>
        <button onClick={handleLogout}>Log out</button>
      </Menu.Item>
    </Menu>
);
    
    const menu_new = (
        <Menu className="Menu-list">
      <Menu.Item key="1" >
        <Link to="/Manage_Personal_Information">Manage personal information</Link>
      </Menu.Item>
      
      <Menu.Item key="2" >
        <Link to="/Order_Management/ToPay">Order Management</Link>
      </Menu.Item>

      <Menu.Item key="3" >
        <Link to="/View_Purchase_History">View Purchase History</Link>
      </Menu.Item>
    </Menu>
    );
  

    return (
        <>
        <div className="header-main">
        <div className="header-backgr">
            <div className="inner-wrap">
                <div className="inner-logo">
                    <ul>
                        <li>
                            
                            <Dropdown overlay={menu_new} trigger={['click']}>
                                <button className="my-list" ><AiOutlineUnorderedList /></button>
                            </Dropdown>
                        </li>
                        <li>
                            <Link to="/Homepage">
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
                            <Link to="/Cart">
                                <FaCartShopping className="my-icon-shop"/>
                            </Link>
                        </li>
                        <li>
                            
                                <Dropdown overlay={menu} trigger={['click']}>
                                <FaCircleUser className="my-icon-user"/>
                                </Dropdown>
                            
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        
        </>
    )
}

export default Headerall;