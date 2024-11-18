import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import AddProductForm from './AddProductForm.jsx';
import EditProductForm from './EditProductForm.jsx';
import Filter from './Filter.jsx';
// Khai báo danh sách thuốc
const initialProducts = [
    {
        ID: '1',
        name: '2',
        type: '1',
        unitPrice: 5000,
        quantityInStock: 50,
        expirationDate: '2025-12-31',
        supplier: 'Nhà A',
        note: 'Không',
    },
    {
        ID: '1',
        name: '2',
        type: '1',
        unitPrice: 5000,
        quantityInStock: 50,
        expirationDate: '2025-12-31',
        supplier: 'Nhà B',
        note: 'Không',
    },
    {
        ID: '1',
        name: '1',
        type: '1',
        unitPrice: 5000,
        quantityInStock: 50,
        expirationDate: '2025-12-31',
        supplier: 'Nhà C',
        note: 'Không',
    },
    {
        ID: '1',
        name: '1',
        type: '1',
        unitPrice: 5000,
        quantityInStock: 50,
        expirationDate: '2025-12-31',
        supplier: 'Nhà D',
        note: 'Không',
    },
    {
        ID: 5,
        name: 'Áo vải',
        type: 'Đồ may đại',
        unitPrice: 10000,
        quantityInStock: 30,
        expirationDate: '2028-06-30',
        supplier: 'Nhà E',
        note: 'Không',
    },
    {
        ID: 6,
        name: 'Quần thủng đít',
        type: 'Đồ cũ',
        unitPrice: 7000,
        quantityInStock: 20,
        expirationDate: '2025-08-15',
        supplier: 'Nhà F',
        note: 'Không',
    },
    {
        ID: 7,
        name: 'Paracetamol',
        type: '1',
        unitPrice: 5000,
        quantityInStock: 50,
        expirationDate: '2026-12-31',
        supplier: 'Nhà G',
        note: 'Không',
    },
    {
        ID: 8,
        name: 'Amoxicillin',
        type: 'Thuốc vô sinh',
        unitPrice: 10000,
        quantityInStock: 30,
        expirationDate: '2027-06-30',
        supplier: 'Nhà ABC',
        note: 'Không',
    },
    {
        ID: 9,
        name: 'Aspirin',
        type: 'Áo vải',
        unitPrice: 7000,
        quantityInStock: 20,
        expirationDate: '2027-08-15',
        supplier: 'Nhà DEF',
        note: 'Không',
    },
    // Thêm các thuốc khác vào đây
];

const ProductList = () => {
    const [searchVal, setSearchVal] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [products, setProducts] = useState(initialProducts);
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [loaiFilter, setLoaiFilter] = useState('');
    const [tonKhoFilter, setTonKhoFilter] = useState('');

    const handleLoaiChange = (event) => {
        setLoaiFilter(event.target.value);
    };

    const handleTonKhoChange = (event) => {
        setTonKhoFilter(event.target.value);
    };
    const itemsPerPage = 6;

    const handleChange = (event) => {
        setSearchVal(event.target.value);
    };
    useEffect(() => {
        const results = initialProducts.filter((product) =>
            product.name.toLowerCase().includes(searchVal.toLowerCase()),
        );
        setSearchResults(results);
        setProducts(results); // tự thêm
    }, [searchVal]);

    const handleAddProduct = (values) => {
        const newProduct = {
            // id: values.id,
            ID: values.ID,
            name: values.name,
            type: values.type,
            unitPrice: values.unitPrice,
            quantityInStock: values.quantityInStock,
            Size: values.size,
            supplier: values.supplier,
            note: values.note,
        };

        setProducts([...products, newProduct]);
        // Close the modal
        setVisible(false);
    };


    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        // console.log("handle ok");
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    function handleClick() {
        alert('You clicked me!');
    }

    const handleDelete = (id) => {
        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa không?`);
        if (confirmed) {
            const updatedProducts = products.filter((product) => product.id !== id);
            setProducts(updatedProducts);
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

    const handleSave = (editedProduct) => {
        // console.log("kayy00");
        const updatedProducts = products.map((product) =>
            product.id === editedProduct.id ? editedProduct : product,
        );
        setProducts(updatedProducts);
        setVisible(false);
        setEditMode(false); // important update
        handleOk();
        handleCancel();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const renderProductRows = currentItems.map((product, id) => (
        <tr key={product.ID}>
            <td>{product.ID}</td>
            <td>{product.name}</td>
            <td>{product.type}</td>
            <td>{product.unitPrice}</td>
            <td>{product.quantityInStock}</td>
            <td>{product.size}</td>
            <td>{product.supplier}</td>
            <td>{product.note}</td>
            <td>
                <button className="edit-btn" onClick={() => handleEdit(product)}>
                    Sửa
                </button>
                {/* <button onClick={handleClick}>Sửa</button> */}
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                    Xoá
                </button>
            </td>
        </tr>
    ));

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <div className="medicine-header">
                <h1>Sản phẩm</h1>
            </div>
            <div className="header">
                <div>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchVal}
                        onChange={handleChange}
                        // onChange={e => { setSearchVal(e.target.value); handleSearchClick(); }}
                    />
                </div>
                <div className="filter-section">
                    {/*<SearchBar/>*/}
                    <Filter
                        onLoaiChange={handleLoaiChange}
                        onTonKhoChange={handleTonKhoChange}
                        // ... (Các props khác cho các bộ lọc) ...
                    />
                </div>
                <Button className="add-button" type="primary" onClick={showModal}>
                    <div className="roboto-font">Thêm sản phẩm</div>
                </Button>
                <Modal title="Thêm Thuốc mới" visible={visible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                    <AddProductForm onAddProduct={handleAddProduct}/>
                </Modal>

                {editMode && selectedProduct && (
                    <Modal
                        title="Chỉnh sửa thông tin Thuốc"
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
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Size</th>
                    <th>Nhà cung cấp</th>
                    <th>Ghi chú</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>{renderProductRows}</tbody>
            </table>

            <div className="page-number" style={{textAlign: 'center'}}>
                {pageNumbers.map((number) => (
                    <button key={number} onClick={() => setCurrentPage(number)}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
