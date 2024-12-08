import React from 'react';
import { Link } from 'react-router-dom';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

function Content() {
    return (
        <div className="card-wrapper">
            {/* <div className='main-cards'> */}
            {/* <Link to="/doctor" style={{ textDecoration: 'none', color: 'inherit' }}> */}
            <Link to="/doctor" className="card">
                <h3 className="card-title">Nhân viên hiện có</h3>
                <div className="card-body">
                    <div className="card-icon">
                        <img src="src/assets/doctor.png"></img>
                    </div>
                    <div className="card-quantity">
                        <p className="card-quantity-title">Tổng</p>
                        <div className="card-quantity-sum">300</div>
                    </div>
                </div>
                {/* BACKEND GET Infor to DB - number of doctors */}
            </Link>
            {/* </Link> */}
            <Link to="/nurse" className="card">
                <h3 className="card-title">Y tá hiện có</h3>
                <div className="card-body">
                    <div className="card-icon">
                        <img src="src/assets/nurse.png"></img>
                    </div>
                    <div className="card-quantity">
                        <p className="card-quantity-title">Tổng</p>
                        <div className="card-quantity-sum">400</div>
                    </div>
                </div>
                {/* BACKEND GET Infor to DB - number of doctors */}
            </Link>
            <Link to="/patient" className="card">
                <h3 className="card-title">Bệnh nhân nội trú</h3>
                <div className="card-body">
                    <div className="card-icon">
                        <img src="src/assets/patient.png"></img>
                    </div>
                    <div className="card-quantity">
                        <p className="card-quantity-title">Tổng</p>
                        <div className="card-quantity-sum">1200</div>
                    </div>
                </div>
                {/* BACKEND GET Infor to DB - number of doctors */}
            </Link>

            {/* </div> */}
        </div>
    );
}

export default Content;
