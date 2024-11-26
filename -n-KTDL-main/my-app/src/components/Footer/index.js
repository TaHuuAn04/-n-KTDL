import React from "react";
import "./footer-style.css";
import closet from "./Closet.png";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

function Footer() {
    return (
        <>
        <div className="footer-main">
            <div className="back-gr">
                <div className="inner-wrap">
                    <div className="inner-logo">
                        <img src={closet} className="my-logo"/>
                    </div>
                    <div className="inner-info">
                        <ul>
                            <li>
                                <p><b>Company info</b></p>
                            </li>
                            <li>
                                <span>CÔNG TY TNHH THỜI TRANG ADHH</span>
                            </li>
                            <li>
                                <span>117 Lý Thường Kiệt, Q.2, TP.HCM</span>
                            </li>
                        </ul>
                    </div>
                    <div className="inner-constact">
                        <ul>
                            <li>
                                <p><b>Constact</b></p>
                            </li>
                            <li>
                                <div className="email-phone">
                                    <span> <BsFillEnvelopeFill className="my-icon-cons email"/> adhh170704@gmail.com </span>
                                    <span> <FaPhoneVolume className="my-icon-cons phone"/> 0358916216 </span>
                                </div>
                            </li>
                            <li>
                                <div className="titok-face">
                                    <span><FaTiktok className="my-icon-cons tiktok"/> ADHH1707@04</span>
                                    <span> <FaFacebook className="my-icon-cons facebook"/> ADHH store </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Footer;