import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import AddPatientForm from './AddPatientForm';
import EditPatientForm from './EditPatientForm';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { useSearch } from '../../SearchContext';
import { useAuth } from '../../AuthContext';
import Filter from "../product-compo/Filter.jsx";
import AddProductForm from "../product-compo/AddProductForm.jsx";
import EditProductForm from "../product-compo/EditProductForm.jsx";
import SimplePagination from "../product-compo/Button_Page.jsx";



const CustomerGrid = () => {
    const {isAdmin} = useAuth();
    const [searchVal, setSearchVal] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const {searchItem} = useSearch();
    const [customers, setCustomers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [editMode, setEditMode] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const itemsPerPage = 8;

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

    useEffect(() => {



        const fetchData = async () => {

            try {

                setLoading(true);

                let response, countResponse;



                if (searchVal) { // Kiểm tra nếu có searchVal

                    const encodedSkuCode = encodeURIComponent(searchVal);

                    const response = await axios.get('http://localhost:3000/customers/search', {
                        params: {
                            custID: encodedSkuCode
                        }
                    })
                        .then(response => {
                            setCustomers([response.data.customers]);
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });

                    // setProducts([response.data.product]);

                    console.log('Response data (search):', response.data);



                } else {

                    // Không có filter, gọi API lấy tất cả sản phẩm



                    const response = await axios.get('http://localhost:3000/customers/all', {
                        params: {
                            page: 1,
                            limit: 5
                        }
                    })
                        .then(response => {
                            setCustomers(response.data.customers);
                            console.log("product", customers);
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    countResponse = await axios.get('http://localhost:3000/customers/customerCount');

                    const totalCount = countResponse ? countResponse.data.count : response.data.count;

                    const total = Math.ceil(totalCount / itemsPerPage);

                    setTotalPages(total);
                    console.log('currentPage:', currentPage);





                    // console.log('Response data (all):', response.data);





                }



            } catch (error) {

                console.error('Error:', error);

                setError(error);

            } finally {

                setLoading(false);

            }

        };

        console.log('Current page:', currentPage);



        fetchData();

    }, [currentPage, searchVal]);

    const handleChange = (event) => {
        setSearchVal(event.target.value);
    };

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
            const updatedCustomers = customers.filter((customer) => customer.id !== id);
            setCustomers(updatedCustomers);

            // Xoá thuốc với id tương ứng khỏi danh sách ban đầu
            // const updatedInitialPatients = initialPatients.filter((patient) => patient.id !== id);
            // initialPatients(updatedInitialPatients);
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
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
        setSelectedCustomer(null);
        handleOk();
        handleCancel();
    };

    const handleSave = (editedCustomer) => {
        // console.log("kayy00");
        const updatedCustomers = customers.map((customer) => (customer.id === editedCustomer.id ? editedCustomer : customer));
        setCustomers(updatedCustomers);
        setVisible(false);
        setEditMode(false); // important update
        handleOk();
        handleCancel();
    };
    const handleNavigateInfo = (id) =>{
        console.log("Navigate to customer detail");
        navigate(`/customer-detail/${id}`);
    }
    const handleNavigateOrder = (id) =>{
        console.log("Navigate to customer detail");
        navigate(`/customer-order/${id}`);
    }

    const renderCustomerRows = customers.map(customer => (
        <tr key={customer['Cust ID']}>

            <td>{customer['Cust ID']}</td>

            <td>{customer['First Name']} {customer['Last Name']}</td>

            <td>{customer.Sex}</td>

            <td>{customer['Subscription Date']}</td>
            <td>

                <button
                    className="edit-btn"
                    onClick={() => handleNavigateOrder(customer['Cust ID'])}
                    style={{
                        fontSize: "16px",
                        color: "#a855f7",
                        background: "none",
                        border: "none",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Xem
                </button>
            </td>
            <td>
                <button
                    className="edit-btn"
                    onClick={() => handleNavigateInfo(customer['Cust ID'])}
                    style={{
                        fontSize: "16px",
                        color: "#a855f7",
                        background: "none",
                        border: "none",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Xem
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

                <h1>Khách hàng</h1>

            </div>

            <div className="header">

                <strong style={{display: 'flex'}}>

                    <input

                        className="search-input"

                        type="text"

                        placeholder="Tìm kiếm khách hàng..."

                        value={searchVal}

                        onChange={handleChange}

                        // onChange={e => { setSearchVal(e.target.value); handleSearchClick(); }}

                    />



                    {/*<SearchBar/>*/}

                    {/*<Filter*/}

                    {/*    // onLoaiChange={handleLoaiChange}*/}
                    {/*    //*/}
                    {/*    // onNhaCungCapChange={handleNhaCungCapChange}*/}
                    {/*    //*/}
                    {/*    // onSapXepChange={handleSapXepChange}*/}

                    {/*    // ... (Các props khác cho các bộ lọc) ...*/}

                    {/*/>*/}



                    {/*<Button className="add-button" type="primary" onClick={showModal}>*/}

                    {/*    <span className="roboto-font">Thêm sản phẩm</span>*/}

                    {/*</Button>*/}

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

                <tbody>{renderCustomerRows}</tbody>

            </table>



            {/*<SimplePagination*/}
            {/*    currentPage={currentPage}*/}
            {/*    totalPages={totalPages}*/}
            {/*    onPageChange={setCurrentPage}*/}
            {/*/>*/}

        </div>

    );
};

export default CustomerGrid;