const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CustomerModel = require('./Model/Customer');  

//Trả về toàn bộ khách hàng
// API ví dụ: http://localhost:3000/customers/all?page=2&limit=10
router.get('/all', async (req, res) => {
    try { 
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const customers = await CustomerModel.find()
            .skip(skip)
            .limit(limit);
        const totalCustomers = await CustomerModel.countDocuments();
        const totalPages = Math.ceil(totalCustomers / limit);
        res.json({
            page,
            totalPages,
            totalCustomers,
            customers,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi!', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi!' });
    }
});

//Thêm khách hàng mới
/*
http://localhost:3000/customers/add
Phần body:
{
    "CustID": 1,
    "FirstName": "John",
    "LastName": "Doe",
    "Company": "XYZ Corp",
    "Phone1": "1234567890",
    "Phone2": "0987654321",
    "Email": "john.doe@example.com",
    "SubscriptionDate": "2023-01-01",
    "Password": "hashedpassword"
}
*/
router.post('/add', async (req, res) => {
    try {
        const { CustID, FirstName, LastName, Company, Phone1, Phone2, Email, SubscriptionDate, Password } = req.body;

        // Kiểm tra nếu các trường bắt buộc không có
        if (!CustID || !FirstName || !LastName || !Phone1 || !Email || !Password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ tất cả các trường thông tin!' });
        }
        const newCustomer = new CustomerModel({
            "Cust ID": CustID,
            "First Name": FirstName,
            "Last Name": LastName,
            "Company": Company,
            "Phone 1": Phone1,
            "Phone 2": Phone2,
            "Email": Email,
            "Subcription Date": SubscriptionDate,
            "password": Password,
        });
        await newCustomer.save();
        res.status(201).json({ message: 'Thêm khách hàng mới thành công', customer: newCustomer });
    } catch (error) {
        console.error('Đã xảy ra lỗi!', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi!' });
    }
});


router.get('/customerCount', async (req, res) => {
    try {
        const count = await CustomerModel.countDocuments();

        res.status(200).json({
            message: 'Lấy số lượng khách hàng thành công!',
            count: count
        });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
    }
});
//Chỉnh sửa thông tin khách hàng
/*
http://localhost:3000/customers/update/672d648b3da568b38d0e6fd8
{
    "CustID": 22,
    "FirstName": "Anna"
}
patch thì không cần gửi full các trường trong body
*/
router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { CustID, FirstName, LastName, Company, Phone1, Phone2, Email, SubscriptionDate, Password } = req.body;
        const updatedCustomer = await CustomerModel.findByIdAndUpdate(
            id, // ID của khách hàng cần sửa
            { 
                "Cust ID": CustID,
                "First Name": FirstName,
                "Last Name": LastName,
                "Company": Company,
                "Phone 1": Phone1,
                "Phone 2": Phone2,
                "Email": Email,
                "Subcription Date": SubscriptionDate,
                "password": Password,
            },
            { new: true } // Trả về khách hàng đã được cập nhật
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng!' });
        }

        res.json({ message: 'Cập nhật thông tin thành công!', customer: updatedCustomer });
    } catch (error) {
        console.error('Đã xảy ra lỗi!', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi!' });
    }
});

//Xóa khách hàng
// http://localhost:3000/customers/delete/672d648b3da568b38d0e6fd8
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await CustomerModel.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại!' });
        }
        res.json({ message: 'Đã xóa thành công!' });
    } catch (error) {
        console.error('Đã xảy ra lỗi!', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi!' });
    }
});

//Filter theo first/last name
// http://localhost:3000/customers/filter?page=1&limit=10&firstName=John
router.get('/filter', async (req, res) => {
    try {
        let filter = {};
        let { page, limit, firstName, lastName } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit; 
        if (firstName) {
            filter['First Name'] = { $regex: new RegExp('^' + firstName, 'i') }; // Tìm kiếm theo firstName không phân biệt chữ hoa chữ thường
        }
        if (lastName) {
            filter['Last Name'] = { $regex: new RegExp('^' + lastName, 'i') };
        }
        const customers = await CustomerModel.find(filter)
            .skip(skip)
            .limit(limit);

        // Tính số lượng khách hàng thỏa mãn filter
        const totalCustomers = await CustomerModel.countDocuments(filter);

        // Tính tổng số trang
        const totalPages = Math.ceil(totalCustomers / limit);

        // Trả về kết quả
        res.json({
            page,
            totalPages,
            totalCustomers,
            customers,
            resultCount: customers.length // Số kết quả thỏa mãn filter được trả về
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi!', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});

//Tìm kiếm dựa trên custID
// http://localhost:3000/customers/search?custID=1217856
router.get('/search', async (req, res) => {
    try {
        const { custID } = req.query;
        if (!custID) {
            return res.status(400).json({ message: 'Vui lòng điền mã khách hàng!' })
        }
        const customer = await CustomerModel.findOne({ 'Cust ID': custID });

        if (!customer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại!' });
        }
        res.json({
            message: 'Tìm kiếm thành công!',
            customer: customer
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi!', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi!' });
    }
});
module.exports = router;  
