import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';
import AddDoctorForm from './AddDoctorForm';
import EditDoctorForm from './EditDoctorForm';
import { Link } from 'react-router-dom'

// BACKEND GET Infor from DB - initialDoctors (danh sach doctor)
// Dữ liệu danh sách các bác sĩ
const initialDoctors = [
  { 
    id: 1, 
    name: 'Bác sĩ 1', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Nhi',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 2, 
    name: 'Bác sĩ B', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Nhi',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 3, 
    name: 'Bác sĩ C', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Da liễu',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 4, 
    name: 'Bác sĩ D', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Phẫu thuật',
    available: true,
    time_off: '5PM',
},
  { 
    id: 5, 
    name: 'Bác sĩ A', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Nội trú',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 6, 
    name: 'Bác sĩ B', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Nhi',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 7, 
    name: 'Bác sĩ C', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Da liễu',
    available: true,
    time_off: '5PM',
},
  { 
    id: 8, 
    name: 'Bác sĩ D', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Phẫu thuật',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 9, 
    name: 'Bác sĩ A', 
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Nội trú',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 10,
    name: 'Bác sĩ B',
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Nhi',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 11,
    name: 'Bác sĩ C',
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Da liễu',
    available: true,
    time_off: '5PM',
  },
  { 
    id: 12,
    name: 'Bác sĩ 2',
    birthday: 1970,
    location: 'TP. HCM',
    email: '@gmail.com',
    phoneNumber: '123',
    sex: 'Nam',
    cccd: 'số cccd',
    department: 'Tai, mũi, họng',
    qualifications: 'Phẫu thuật',
    available: true,
    time_off: '5PM',
  },
  // Thêm các bác sĩ khác nếu cần
];


const DoctorGrid = () => {
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const itemsPerPage = 9;

    // const [query, setQuery] = useState('');
    // const [filteredItems, setFilteredItems] = useState([]);

 
    // useEffect(() => {
    //     const filtered = initialDoctors.filter(item =>
    //         item.name.toLowerCase().includes(query.toLowerCase())
    //     );
    //     setFilteredItems(filtered);
    // }, [query]);


    // BACKEND FIND Infor in DB - doctor's name (searchVal)
  const handleChange = event => {
    setSearchVal(event.target.value);
  };

  useEffect(() => {
    const results = initialDoctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchVal.toLowerCase()));
      setSearchResults(results);
      setDoctors(results); // tự thêm
  }, [searchVal]);


  const handleAddDoctor = (values) => {
    // BACKEND ADD Infor to DB - new Doctor

    // Generate a new ID for the new medicine
    const newDoctor = {     
      // id: values.id,          ///////// comment lại chỗ này giúp t
      name: values.name,
      birthday: values.birthday,
      location: values.location,
      email: values.email,
      phoneNumber: values.phoneNumber,
      sex: values.sex,
      cccd: values.cccd,
      department: values.department,
      qualifications: values.qualifications, 
      available: values.available,
      time_off: values.time_off,
    };
    // Add the new medicine to the list of medicines
    setDoctors([...doctors, newDoctor]);
    // Close the modal
    setVisible(false);
  };

  // function handleSearchClick() {
  //   if (searchVal === "") {
  //     setDoctors(initialDoctors);
  //     return;
  //   }
  //   const filterBySearch = initialDoctors.filter((doctor) => {
  //     if (doctor.name.toLowerCase().includes(searchVal.toLowerCase())) {
  //       return doctor;
  //     }
  //   });
  //   setDoctors(filterBySearch);
  // }

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  function handleClick() {
    alert('You clicked me!');
  }


  // BACKEND DELETE Infor in DB - doctor's ID
  const handleDelete = (id) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa không?`);
    if (confirmed) {
      // Xoá thuốc với id tương ứng khỏi danh sách hiện tại
      const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
      setDoctors(updatedDoctors);

      // Xoá thuốc với id tương ứng khỏi danh sách ban đầu
      // const updatedInitialDoctors = initialDoctors.filter((doctor) => doctor.id !== id);
      // initialDoctors(updatedInitialDoctors);
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setEditMode(true);
  };
  // const handleUpdateDoctor = (updatedDoctor) => {
  //   const updatedDoctors = doctors.map((doctor) =>
  //     doctor.id === updatedDoctor.id ? updatedDoctor : doctor
  //   );
  //   setDoctors(updatedDoctors);
  //   setEditMode(false);
  //   setSelectedDoctor(null);
  // };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedDoctor(null);
    handleOk();
    handleCancel();
  };

  // BACKEND UPDATE Infor to DB - doctor's ID (editedDoctor)
  const handleSave = (editedDoctor) => {
    // console.log("kayy00");
    const updatedDoctors = doctors.map(doctor =>
      doctor.id === editedDoctor.id ? editedDoctor : doctor
    );
    setDoctors(updatedDoctors);
    setVisible(false);
    setEditMode(false); // important update
    handleOk();
    handleCancel();
  };


  const handleViewDetail = (doctor) => {

  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = doctors.slice(indexOfFirstItem, indexOfLastItem);

  const renderDoctorRows = currentItems.map((doctor, id) => (
      <div key={doctor.id} className="doctor-card">
        <h2>{doctor.name}</h2>
        <p>Chuyên khoa: {doctor.qualifications}</p>
        <div>
          {/* <button onClick={toggleForm}>Xem</button> */}
          <button className='edit-btn'
            onClick={() => handleEdit(doctor)}>Sửa</button>
          {/* <button onClick={handleClick}>Sửa</button> */}
          <button className='delete-btn'
            onClick={() => handleDelete(doctor.id)}>Xoá</button>
        </div>
      </div>
  ));

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(doctors.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }


  return (
    <div>
        <div className="doctor-header">
            <h1 className='doctor-total'>Bác sĩ hiện có</h1>
            <div className="total-doctors">{doctors.length}</div>
            <div className="search-bar">
                <input
                className="search-input"
                type="text"
                placeholder="Tìm kiếm bác sĩ..."
                // value={query}
                // onChange={(e) => setQuery(e.target.value)}
                value={searchVal}
                onChange={handleChange}
                // onChange={e => { setSearchVal(e.target.value); handleSearchClick(); }}
                // value={searchTerm}
                // onChange={handleSearch}
                />
            </div>
            <Button className="add-button" type="primary" 
              onClick={showModal}>
              Thêm bác sĩ
            </Button>
            {/* <button 
              onClick={handleClick}>Thêm bác sĩ</button> */}
            <Modal
              title="Thêm Bác sĩ mới"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null} // To hide the default footer buttons
            >
              <AddDoctorForm 
                // onCancel={}
                onAddDoctor={handleAddDoctor} />
            </Modal>

            {editMode && selectedDoctor && (
              <Modal
                title="Chỉnh sửa thông tin Bác sĩ"
                visible={editMode}
                onCancel={handleCancelEdit}
                footer={null}
                // onSave={handleSave}
              >
                <EditDoctorForm
                  doctor={selectedDoctor}
                  // onUpdateDoctor={handleUpdateDoctor}
                  onSave={handleSave}
                  onCancel={() => setVisible(false)} 
                />
              </Modal>
            )}

        </div>
        <div className="doctor-grid">
          {/* <div> */}
            {renderDoctorRows}
          {/* </div> */}
            {/* {doctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <h2>{doctor.name}</h2>
                  <p>Chuyên khoa: {doctor.qualifications}</p>
                  <div>
                    <button onClick={handleClick}>Sửa</button>
                    <button onClick={() => handleDelete(doctor.id)}>Xoá</button>
                  </div>
                </div>
            ))} */}
        </div>
        <div className="page-number" style={{textAlign: 'center', bottom: 0, marginTop: "8px"}}>
          {pageNumbers.map(number => (
            <button style={{padding: "4px 8px", marginLeft: "4px"}} key={number} onClick={() => setCurrentPage(number)}>
              {number}
            </button>
          ))}
        </div>
    </div>
  );
};

export default DoctorGrid;
