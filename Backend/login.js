const express = require('express');
const router = express.Router();
const CustomerModel = require('./Model/Customer');
const EmployeeModel = require('./Model/Employee');

// Hàm đăng nhập kiểm tra trong cả Employee và Customer
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập username và mật khẩu!' });
    }

    try {
        // Kiểm tra trong model Employee (Admin)
        const admin = await EmployeeModel.findOne({ _id: username });

        if (admin) {
            if (admin.password !== password) {
                return res.status(401).json({ message: 'Sai mật khẩu!' });
            }
            return res.status(200).json({
                message: 'Đăng nhập thành công!',
                user: {
                    username: admin._id,
                    name: admin["First Name"],
                    role: 'admin'
                },
                isAdmin: true,
            });
        }

        // Nếu không phải Admin, kiểm tra trong model Customer
        const customer = await CustomerModel.findOne({ "Cust ID": username });

        if (customer) {
            if (customer.password !== password) {
                return res.status(401).json({ message: 'Sai mật khẩu!' });
            }
            return res.status(200).json({
                message: 'Đăng nhập thành công!',
                user: {
                    username: customer["Cust ID"],
                    name: `${customer["First Name"]} ${customer["Last Name"]}`,
                    role: 'customer'
                },
                isAdmin: false,
            });
        }

        // Nếu không tìm thấy cả trong Employee lẫn Customer
        return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

module.exports = router;