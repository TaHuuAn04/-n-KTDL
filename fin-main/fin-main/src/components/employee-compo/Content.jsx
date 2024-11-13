import React from 'react'
import DoctorGrid from './DoctorGrid';
// import DoctorForm from './DoctorForm';
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';

function Content() {



  return (
    
    <main className='doctor-main-container'>
        
        <div className="app">
            <DoctorGrid />
        </div>

        
    </main>
  )
}

export default Content