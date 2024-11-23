import { useState } from 'react';
import React from 'react';
import '../App.css';
import Layout from '../Layout';
import Content from '../components/customer-compo/Content';


function Customer() {
    return (
        <div className="grid-container">
            <Layout>
                <Content />
            </Layout>
        </div>
    );
}

export default Customer;
