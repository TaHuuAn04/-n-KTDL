import React from 'react';
import OrderList from './Order_List.jsx';
// import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
// import {
//     BarChart,
//     Bar,
//     Cell,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     LineChart,
//     Line,
// } from 'recharts';

function Content() {

    return (
        <main className="product-main-container">
            <div>
                <OrderList />
            </div>
        </main>
    );
}

export default Content;
