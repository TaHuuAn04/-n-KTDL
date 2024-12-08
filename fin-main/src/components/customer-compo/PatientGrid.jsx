import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import AddPatientForm from './AddPatientForm';
import EditPatientForm from './EditPatientForm';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { useSearch } from '../../SearchContext';
import { useAuth } from '../../AuthContext';
import Filter from "../product-compo/Filter.jsx";
import AddProductForm from "../product-compo/AddProductForm.jsx";
import EditProductForm from "../product-compo/EditProductForm.jsx";
import SimplePagination from "../product-compo/Button_Page.jsx";


const initialCustomer = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        Subsciption: '01/01/2021',
        birthday: '01/01/1990',
        location: 'TPHCM',
        email: '',
        phoneNumber: '0123456789',
        sex: 'Nam',
        cccd: '123456789',
        blood_Type: 'A+',
    }
];

const PatientGrid = () => {
    const {isAdmin} = useAuth();
    const [searchVal, setSearchVal] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const {searchItem} = useSearch();
    const [customers, setCustomers] = useState(initialCustomer);
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
    //     const filtered = initialCustomer.filter(item =>
    //         item.name.toLowerCase().includes(query.toLowerCase())
    //     );
    //     setFilteredItems(filtered);
    // }, [query]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    useEffect(()=> {
        // if (searchItem) {
        //     setIsSearch(true);
        //     axios.get(`http://localhost:3000/api/search?q=${searchItem}`)
        //     .then(response => setPatientList(response.data))
        //     .catch(err => {
        //         console.error("Error fetching search result:",err);
        //     })
        // } else {
        //     axios.get("http://localhost:3000/patients")
        //     .then(response => setPatientList(response.data))
        //     .catch(err => {
        //         console.error("Error fetching patients:",err);
        //     })
        // }


    },[searchVal]);

    const handleChange = (event) => {
        setSearchVal(event.target.value);
    };

    useEffect(() => {
        console.log("searchItem");
        const results = initialCustomer.filter(customer =>
            customer.name.toLowerCase().includes(searchVal.toLowerCase()));
        setSearchResults(results);
        setCustomers(results);
    }, [searchVal]);

    const handleAddCustomer = (values) => {
        // Generate a new ID for the new medicine
        const newCustomer = {
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
        setCustomers([...customers, newCustomer]);
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
            const updatedCustomers = customers.filter((patient) => patient.id !== id);
            setCustomers(updatedCustomers);

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
        const updatedPatients = customers.map((patient) => (patient.id === editedPatient.id ? editedPatient : patient));
        setCustomers(updatedPatients);
        setVisible(false);
        setEditMode(false); // important update
        handleOk();
        handleCancel();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

    const renderPatientRows = customers.map(customer => (
        <tr key={customer.id}>

            <td>{customer.id}</td>

            <td>{customer.name}</td>

            <td>{customer.sex}</td>

            <td>{customer.Subscription}</td>
            <td>

                <button
                    className="edit-btn"
                    onClick={() => handleEdit(employeeData)}
                    style={{
                        fontSize: "16px",
                        color: "#a855f7",
                        background: "none",
                        border: "none",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Thêm
                </button>

                {/* <button onClick={handleClick}>Sửa</button> */}

                <button className="delete-btn" onClick={() => handleDelete(customer._id)}>

                    Xoá

                </button>

            </td>

        </tr>
    ));

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(customers.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (

        <div>

            <div className="medicine-header">

            <h1>Sản phẩm</h1>

            </div>

            <div className="header">

                <strong style={{display: 'flex'}}>

                    <input

                        className="search-input"

                        type="text"

                        placeholder="Tìm kiếm sản phẩm..."

                        value={searchVal}

                        onChange={handleChange}

                        // onChange={e => { setSearchVal(e.target.value); handleSearchClick(); }}

                    />



                    {/*<SearchBar/>*/}

                    <Filter

                        // onLoaiChange={handleLoaiChange}
                        //
                        // onNhaCungCapChange={handleNhaCungCapChange}
                        //
                        // onSapXepChange={handleSapXepChange}

                        // ... (Các props khác cho các bộ lọc) ...

                    />



                    <Button className="add-button" type="primary" onClick={showModal}>

                        <span className="roboto-font">Thêm sản phẩm</span>

                    </Button>

                </strong>

                {/*<Modal title="Thêm sản phẩm mới" visible={visible} onOk={handleOk} onCancel={handleCancel}*/}

                {/*       footer={null}>*/}

                {/*    <AddProductForm onAddProduct={handleAddProduct}/>*/}

                {/*</Modal>*/}



                {/*{editMode && selectedProduct && (*/}

                {/*    <Modal*/}

                {/*        title="Chỉnh sửa thông tin sản phẩm"*/}

                {/*        open={editMode}*/}

                {/*        onCancel={handleCancelEdit}*/}

                {/*        footer={null}*/}

                {/*        onSave={handleSave}*/}

                {/*    >*/}

                {/*        /!*<EditProductForm*!/*/}
                {/*        */}
                {/*        /!*    product={selectedProduct}*!/*/}
                {/*        */}
                {/*        /!*    onSave={handleSave}*!/*/}
                {/*        */}
                {/*        /!*    onCancel={() => setVisible(false)}*!/*/}
                {/*        */}
                        {/*/>*/}

                {/*    </Modal>*/}

                {/*)}*/}



            </div>





            <table className="medicine-table">

                <thead>

                <tr>

                    <th>Mã khách hàng</th>

                    <th>Tên khách hàng</th>

                    <th>Giới tính</th>

                    <th>Ngày đăng kí</th>

                    <th>Lịch sử đơn hàng</th>

                    <th>Thông tin cá nhân</th>

                </tr>

                </thead>

                <tbody>{renderPatientRows}</tbody>

            </table>



            {/*<SimplePagination*/}
            {/*    currentPage={currentPage}*/}
            {/*    totalPages={totalPages}*/}
            {/*    onPageChange={setCurrentPage}*/}
            {/*/>*/}

        </div>

    );
};

export default PatientGrid;