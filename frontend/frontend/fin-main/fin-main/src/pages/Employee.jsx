import '../App.css';
import React from 'react';

// import Header from './Header'
// import Sidebar from './Sidebar'
import Content from '../components/employee-compo/Content';
import Layout from '../Layout';

function Employee() {
    return (
        <div className="grid-container">
            <Layout>
                <Content/>
            </Layout>
        </div>
    );
}

export default Employee;
