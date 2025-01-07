import React from 'react';
import '../App.css';
import Layout from '../Layout';
import Content from '../components/dashboard-compo/Content';
import Logo from '../components/commons/Logo';
import UserInfo from '../components/commons/UserInfo';
import Sidebar from '../components/commons/Sidebar';
import Product from "./Product.jsx";

function Summary() {
    return (
        <div className="grid-container">
            <Layout>
                <Content/>
            </Layout>
        </div>
    );
}
export default Summary;