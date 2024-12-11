const express = require('express');
const router = express.Router();
const CustomerModel = require('./Model/Customer');
const EmployeeModel = require('./Model/Employee');
const SHA1 = require('./SHA/SHA1');

// API đăng nhập cho khách hàng
router.post('/customer/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Customer login with username: ", username);
    console.log("Customer login with password: ", password);

    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập username và mật khẩu!' });
    }

    const hashedPassword = SHA1(password);
    console.log("Hashed password", hashedPassword);

    try {
        const customer = await CustomerModel.findOne({ "Email": username });

        if (customer) {
            if (customer.password !== hashedPassword) {
                return res.status(401).json({ message: 'Sai mật khẩu!' });
            }
            return res.status(200).json({
                message: 'Đăng nhập thành công!',
                user: customer
            });
        }

        return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

// API đăng nhập cho nhân viên
router.post('/employee/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Employee login with username: ", username);
    console.log("Employee login with password: ", password);

    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập username và mật khẩu!' });
    }

    const hashedPassword = SHA1(password);
    console.log("Hashed password", hashedPassword);

    try {
        const admin = await EmployeeModel.findOne({ "User_Code": username });

        if (admin) {
            if (admin.password !== hashedPassword) {
                return res.status(401).json({ message: 'Sai mật khẩu!' });
            }
            return res.status(200).json({
                message: 'Đăng nhập thành công!',
                user: admin
            });
        }

        return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

module.exports = router;