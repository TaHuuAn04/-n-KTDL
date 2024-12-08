import React from 'react';
import CustomerGrid from './CustomerGrid.jsx';
// import PatientForm from './PatientForm';

function Content() {
    return (
        <main className="doctor-main-container">
            <div className="app">
                <CustomerGrid />
            </div>
        </main>
    );
}

export default Content;
