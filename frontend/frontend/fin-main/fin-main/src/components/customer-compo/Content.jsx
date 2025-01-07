import React from 'react';
import PatientGrid from './PatientGrid';
// import PatientForm from './PatientForm';

function Content() {
    return (
        <main className="doctor-main-container">
            <div className="app">
                <PatientGrid />
            </div>
        </main>
    );
}

export default Content;
