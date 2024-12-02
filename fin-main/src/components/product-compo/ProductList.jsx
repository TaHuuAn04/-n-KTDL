import React, { useState, useEffect } from 'react';

import { Button, Modal } from 'antd';

import AddProductForm from './AddProductForm.jsx';

import EditProductForm from './EditProductForm.jsx';

import Filter from './Filter';

import axios from 'axios';

import SimplePagination from './Button_Page.jsx';
//Khai báo danh sách thuốc



const ProductList = () => {

    const [searchVal, setSearchVal] = useState('');

    const [searchResults, setSearchResults] = useState([]);

    const [products, setProducts] = useState([]);

    const [visible, setVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [error, setError] = useState(null);

    // const [loaiFilter, setLoaiFilter] = useState('');

    // const [tonKhoFilter, setTonKhoFilter] = useState('');

    const [filters, setFilters] = useState({

        category: null,

        supplierID: null,

        sortBy: null,

        // ...

    });

    const handleLoaiChange = (category) => {

        setFilters({ ...filters, category });

        console.log('Category:', category);

    };



    const handleNhaCungCapChange = (supplierID) => {

        setFilters({ ...filters, supplierID });

        console.log('Supplier:', supplierID);

    };



    const handleSapXepChange = (sortBy) => {

        setFilters({ ...filters, sortBy });

        console.log('Sort:', sortBy);

    };

    const itemsPerPage = 8;



    const handleChange = async (event) => {

        setSearchVal(event.target.value);



        // try {

        //     console.log('Search value:', event.target.value);

        //     // Gọi API để tìm kiếm sản phẩm theo SKU Code

        //     const encodedSkuCode = encodeURIComponent(event.target.value);

        //     const response = await axios.get('http://localhost:3000/products/' + encodedSkuCode);

        //     setSearchResults(response.data.products);

        // } catch (error) {

        //     console.error('Lỗi khi tìm kiếm sản phẩm:', error);

        //     // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng

        //     if (error.response && error.response.status === 404) {

        //         setSearchResults(null); // Hoặc hiển thị thông báo "Không tìm thấy sản phẩm"

        //     }

        // }

    };





    useEffect(() => {



        const fetchData = async () => {

            try {

                setLoading(true);

                let response, countResponse;



                // Kiểm tra xem có filter nào được áp dụng hay không

                if (Object.values(filters).some(value => value !== null)) {

                    // Có filter được áp dụng, gọi API với filters

                    const response = await axios.get('http://localhost:3000/products/filter', {

                        params: {
                            ...filters,
                            page: currentPage,
                            limit: itemsPerPage,
                        }
                    });
                    countResponse = await axios.get('http://localhost:3000/products/count', {
                        params: filters
                    });
                    const totalCount = countResponse ? countResponse.data.count : response.data.count;

                    const total = Math.ceil(totalCount / itemsPerPage);

                    setTotalPages(total);
                    console.log('totalPage', totalPages);

                    console.log('Response data (filtered):', response.data);

                    setProducts(response.data.products);

                }else if (searchVal) { // Kiểm tra nếu có searchVal

                    const encodedSkuCode = encodeURIComponent(searchVal);

                    const response = await axios.get(`http://localhost:3000/products/id/${encodedSkuCode}`);

                    setProducts([response.data.product]);

                    console.log('Response data (search):', response.data);



                } else {

                    // Không có filter, gọi API lấy tất cả sản phẩm



                    const response = await axios.get('http://localhost:3000/products/all', {

                        params: {
                            page: currentPage,
                            limit: itemsPerPage,
                        }
                    });
                    countResponse = await axios.get('http://localhost:3000/products/count');

                    const totalCount = countResponse ? countResponse.data.count : response.data.count;

                    const total = Math.ceil(totalCount / itemsPerPage);

                    setTotalPages(total);
                    console.log('currentPage:', currentPage);





                    console.log('Response data (all):', response.data);

                    setProducts(response.data.products);
                    console.log("product", products);



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

    }, [ filters,currentPage, searchVal]);



    function getSupplierInfo(supplier) {

        switch (supplier) {

            case 'Nhà cung cấp A':

                return { SupplierID: 1, ['Supplier Code']: 'NCC_A' };

            case 'Nhà cung cấp B':

                return { SupplierID: 2, ['Supplier Code']: 'NCC_B' };

            case 'Nhà cung cấp C':

                return { SupplierID: 3, ['Supplier Code']: 'NCC_C' };

            case 'Nhà cung cấp D':

                return { SupplierID: 4, ['Supplier Code']: 'NCC_D' };

            case 'Nhà cung cấp E':

                return { SupplierID: 5, ['Supplier Code']: 'NCC_E' };

            default:

                return { SupplierID: null, ['Supplier Code']: null };

        }

    }

    const handleAddProduct = async (values) => {

        try{

            const newProduct = {

                // id: values.id,

                ['SKU Code']: values['SKU Code'],

                Name: values.Name,

                ['Design No ']: values['Design No '],

                Category: values.Category,

                Price: values.Price,

                Stock: values['stock in B1'] + values['stock in B2'] + values['stock in B3'] + values['stock in B4'],

                ['stock in B1']: values['stock in B1'],

                ['stock in B2']: values['stock in B2'],

                ['stock in B3']: values['stock in B3'],

                ['stock in B4']: values['stock in B4'],

                Size: values.Size,

                Supplier: values.Supplier,

                ...getSupplierInfo(values.Supplier),

                Color: values.Color,

            };

            const response = await axios.post('http://localhost:3000/products/add', newProduct);



            // Xử lý response từ API

            if (response.status === 201) { // 201 Created

                console.log('Response:', response); // In ra toàn bộ response

                console.log('Message:', response.data.message); // In ra message

                console.log('Thêm sản phẩm thành công:', response.data);

                setProducts([...products, newProduct]); // Cập nhật state products

                setVisible(false); // Đóng modal

            } else {

                console.error('Lỗi khi thêm sản phẩm:', response.data);

                // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng

            }

        }catch (error) {

            console.error('Lỗi khi thêm sản phẩm:', error);

            // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng

        }

    };





    const showModal = () => {

        setVisible(true);

    };



    const handleOk = () => {

        console.log("handle ok");

        setVisible(false);

    };



    const handleCancel = () => {

        setVisible(false);

    };



    const handleDelete = async (_id) => {

        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm này không?`);

        if (confirmed) {

            try {

                // Gửi request DELETE đến API

                console.log('Xóa sản phẩm với id:', _id);

                const response = await axios.delete(`http://localhost:3000/products/delete/${_id}`);



                // Xử lý response từ API

                if (response.status === 200) {

                    console.log('Xóa sản phẩm thành công:', response.data);

                    const updatedProducts = products.filter((product) => product._id !== _id);

                    setProducts(updatedProducts);

                } else {

                    console.error('Lỗi khi xóa sản phẩm:', response.data);

                    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng

                }

            } catch (error) {

                console.error('Lỗi khi xóa sản phẩm:', error);

                // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng

            }

        }

    };



    const handleEdit = (product) => {

        setSelectedProduct(product);

        setEditMode(true);

    };





    const handleCancelEdit = () => {

        setEditMode(false);

        setSelectedProduct(null);

        handleOk();

        handleCancel();

    };



    const handleSave = async (editedProduct) => {

        try {

            // Gọi API để cập nhật sản phẩm trên server

            const response = await axios.patch(`http://localhost:3000/products/update/${editedProduct._id}`, editedProduct);



            // Xử lý response từ API

            if (response.status === 200) {

                console.log('Cập nhật sản phẩm thành công:', response.data);



                // Cập nhật danh sách sản phẩm ở frontend

                const updatedProducts = products.map((product) =>

                    product._id === editedProduct._id ? editedProduct : product

                );

                setProducts(updatedProducts);



                setVisible(false);

                setEditMode(false);

            } else {

                console.error('Lỗi khi cập nhật sản phẩm:', response.data);

                // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng

            }

        } catch (error) {

            console.error('Lỗi khi cập nhật sản phẩm:', error);

            // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng

        }

    };




    const renderProductRows = products.map(product => (

        <tr key={product._id}>

            <td>{product['SKU Code']}</td>

            <td>{product.Name}</td>

            <td>{product.Category}</td>

            <td>{product.Price}</td>

            <td>{product.Stock}</td>

            <td>{product.Size}</td>

            <td>{product.Supplier}</td>

            <td>{product.Color}</td>

            <td>

                <button className="edit-btn" onClick={() => handleEdit(product)}>

                    Sửa

                </button>

                {/* <button onClick={handleClick}>Sửa</button> */}

                <button className="delete-btn" onClick={() => handleDelete(product._id)}>

                    Xoá

                </button>

            </td>

        </tr>

    ));



    // Tạo mảng số trang

    const pageNumbers = [];
    console.log("totalPages", totalPages);
    for (let i = 1; i <= totalPages; i++) {
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

                        onLoaiChange={handleLoaiChange}

                        onNhaCungCapChange={handleNhaCungCapChange}

                        onSapXepChange={handleSapXepChange}

                        // ... (Các props khác cho các bộ lọc) ...

                    />



                    <Button className="add-button" type="primary" onClick={showModal}>

                        <span className="roboto-font">Thêm sản phẩm</span>

                    </Button>

                </strong>

                <Modal title="Thêm sản phẩm mới" visible={visible} onOk={handleOk} onCancel={handleCancel}

                       footer={null}>

                    <AddProductForm onAddProduct={handleAddProduct}/>

                </Modal>



                {editMode && selectedProduct && (

                    <Modal

                        title="Chỉnh sửa thông tin sản phẩm"

                        open={editMode}

                        onCancel={handleCancelEdit}

                        footer={null}

                        onSave={handleSave}

                    >

                        <EditProductForm

                            product={selectedProduct}

                            onSave={handleSave}

                            onCancel={() => setVisible(false)}

                        />

                    </Modal>

                )}



            </div>





            <table className="medicine-table">

                <thead>

                <tr>

                    <th>SKU Code</th>

                    <th>Tên</th>

                    <th>Loại</th>

                    <th>Giá</th>

                    <th>Số lượng</th>

                    <th>Size</th>

                    <th>Nhà cung cấp</th>

                    <th>Màu</th>

                    <th>Hành động</th>

                </tr>

                </thead>

                <tbody>{renderProductRows}</tbody>

            </table>



            <SimplePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </div>

    );

};



export default ProductList;