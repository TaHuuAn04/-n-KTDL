import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import AddPatientForm from './AddPatientForm';
import EditPatientForm from './EditPatientForm';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { useSearch } from '../../SearchContext';
import { useAuth } from '../../AuthContext';




const PatientGrid = () => {
    const {isAdmin} = useAuth();
    const [searchVal, setSearchVal] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const {searchItem} = useSearch();
    const [patients, setPatients] = useState([]);
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [editMode, setEditMode] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientList, setPatientList] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const itemsPerPage = 9;

    // const [query, setQuery] = useState('');
    // const [filteredItems, setFilteredItems] = useState([]);

    // useEffect(() => {
    //     const filtered = initialPatients.filter(item =>
    //         item.name.toLowerCase().includes(query.toLowerCase())
    //     );
    //     setFilteredItems(filtered);
    // }, [query]);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    useEffect(()=> {
        if (searchItem) {
            setIsSearch(true);
            axios.get(`http://localhost:3000/api/search?q=${searchItem}`)
            .then(response => setPatientList(response.data))
            .catch(err => {
                console.error("Error fetching search result:",err);
            }) 
        } else {
            axios.get("http://localhost:3000/patients")
            .then(response => setPatientList(response.data))
            .catch(err => {
                console.error("Error fetching patients:",err);
            }) 
        }

    },[searchItem]);

    const handleChange = (event) => {
        setSearchVal(event.target.value);
    };

    useEffect(() => {
        const results = patientList.filter((patient) =>
            patient.name.toLowerCase().includes(searchVal.toLowerCase()),
        );
        setSearchResults(results);
        setPatients(results); // tự thêm
    }, [searchVal]);

    const handleAddPatient = (values) => {
        // Generate a new ID for the new medicine
        const newPatient = {
            // id: values.id,
            name: values.name,
            birthday: values.birthday,
            location: values.location,
            email: values.email,
            phoneNumber: values.phoneNumber,
            sex: values.sex,
            cccd: values.cccd,
            bloodType: values.bloodType,
        };
        // Add the new medicine to the list of medicines
        setPatients([...patients, newPatient]);
        // Close the modal
        setVisible(false);
    };

    // function handleSearchClick() {
    //   if (searchVal === "") {
    //     setPatients(initialPatients);
    //     return;
    //   }
    //   const filterBySearch = initialPatients.filter((patient) => {
    //     if (patient.name.toLowerCase().includes(searchVal.toLowerCase())) {
    //       return patient;
    //     }
    //   });
    //   setPatients(filterBySearch);
    // }

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
        // resetFields();
    };

    function handleClick() {
        alert('You clicked me!');
    }

    const handleDelete = (id) => {
        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa không?`);
        if (confirmed) {
            // Xoá thuốc với id tương ứng khỏi danh sách hiện tại
            const updatedPatients = patients.filter((patient) => patient.id !== id);
            setPatients(updatedPatients);

            // Xoá thuốc với id tương ứng khỏi danh sách ban đầu
            // const updatedInitialPatients = initialPatients.filter((patient) => patient.id !== id);
            // initialPatients(updatedInitialPatients);
        }
    };

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setEditMode(true);
    };
    // const handleUpdatePatient = (updatedPatient) => {
    //   const updatedPatients = patients.map((patient) =>
    //     patient.id === updatedPatient.id ? updatedPatient : patient
    //   );
    //   setPatients(updatedPatients);
    //   setEditMode(false);
    //   setSelectedPatient(null);
    // };

    const handleCancelEdit = () => {
        setEditMode(false);
        setSelectedPatient(null);
        handleOk();
        handleCancel();
    };

    const handleSave = (editedPatient) => {
        // console.log("kayy00");
        const updatedPatients = patients.map((patient) => (patient.id === editedPatient.id ? editedPatient : patient));
        setPatients(updatedPatients);
        setVisible(false);
        setEditMode(false); // important update
        handleOk();
        handleCancel();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = patients.slice(indexOfFirstItem, indexOfLastItem);

    const renderPatientRows = patientList.map(patient => (
        <Link to = {`/patient-detail`} key={patient.id} className="doctor-card">
            <h2>{patient.name}</h2>
            <p>
                Năm sinh: {patient.birthday}, Nhóm máu: {patient.blood_type}
            </p>
            <div>
                { isAdmin && <button className="edit-btn" onClick={() => handleEdit(patient)}>
                    Sửa
                </button>}
                {/* <button onClick={handleClick}>Sửa</button> */}
                { isAdmin && <button className="delete-btn" onClick={() => handleDelete(patient.id)}>
                    Xoá
                </button>}
            </div>
        </Link>
    ));

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(patients.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <div className="doctor-header">
                <h1 className="doctor-total">Bệnh nhân hiện có</h1>
                <div className="total-doctors">{patientList.length}</div>
                <div className="search-bar">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Tìm kiếm bệnh nhân..."
                        // value={query}
                        // onChange={(e) => setQuery(e.target.value)}
                        value={searchVal}
                        onChange={handleChange}
                        // onChange={e => { setSearchVal(e.target.value); handleSearchClick(); }}
                        // value={searchTerm}
                        // onChange={handleSearch}
                    />
                </div>
                { isAdmin && <Button className="add-button" type="primary" onClick={showModal}>
                    Thêm bệnh nhân
                </Button>}
                {/* <button 
              onClick={handleClick}>Thêm bác sĩ</button> */}
                <Modal
                    title="Thêm Bệnh nhân mới"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null} // To hide the default footer buttons
                >
                    <AddPatientForm onAddPatient={handleAddPatient} />
                </Modal>

                {editMode && selectedPatient && (
                    <Modal
                        title="Chỉnh sửa thông tin Bệnh nhân"
                        visible={editMode}
                        onCancel={handleCancelEdit}
                        footer={null}
                        // onSave={handleSave}
                    >
                        <EditPatientForm
                            patient={selectedPatient}
                            // onUpdatePatient={handleUpdatePatient}
                            onSave={handleSave}
                            onCancel={() => setVisible(false)}
                        />
                    </Modal>
                )}
            </div>
            <div className="doctor-grid">
                {/* <div> */}
                {renderPatientRows}
                {/* </div> */}
                {/* {patients.map(patient => (
                <div key={patient.id} className="patient-card">
                  <h2>{patient.name}</h2>
                  <p>Chuyên khoa: {patient.qualifications}</p>
                  <div>
                    <button onClick={handleClick}>Sửa</button>
                    <button onClick={() => handleDelete(patient.id)}>Xoá</button>
                  </div>
                </div>
            ))} */}
            </div>

            <div className="page-number" style={{ textAlign: 'center', bottom: 0 }}>
                {pageNumbers.map((number) => (
                    <button key={number} onClick={() => paginate(number)}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PatientGrid;