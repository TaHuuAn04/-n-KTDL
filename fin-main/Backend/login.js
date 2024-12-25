const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CustomerModel = require('./Model/Customer');
const EmployeeModel = require('./Model/Employee');
const SHA1 = require('./SHA/SHA1');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Khuyến khích dùng biến môi trường


// API đăng nhập cho khách hàng
router.post('/customer/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Customer login with username: ", username);
    console.log("Customer login with password: ", password);

    // Kiểm tra xem có thiếu thông tin không
    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập username và mật khẩu!' });
    }

    // Băm mật khẩu
    const hashedPassword = SHA1(password).toString();
    console.log("Hashed password", hashedPassword);

    try {
        // Tìm khách hàng dựa trên username (email)
        const customer = await CustomerModel.findOne({ "Email": username });
        // Nếu không tìm thấy khách hàng
        if (!customer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại!' });
        }

        // Nếu không tìm thấy khách hàng
        if (!customer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại!' });
        }

        // So sánh mật khẩu đã băm
        if (customer.password !== hashedPassword) {
            return res.status(401).json({ message: 'Sai mật khẩu!' });
        }

        // Tạo token JWT
        const payload = {
            custID: customer["Cust ID"],
            email: customer.Email,
            name: customer.Name,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Trả về token cho client
        return res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
        });
        // So sánh mật khẩu đã băm
        if (customer.password !== hashedPassword) {
            return res.status(401).json({ message: 'Sai mật khẩu!' });
        }

        // Tạo token JWT
        const payload = {
            custID: customer["Cust ID"],
            email: customer.Email,
            name: customer.Name,
            role: 'customer'
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Trả về token cho client
        return res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Đã có lỗi xảy ra, vui lòng thử lại!' });
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

    const hashedPassword = SHA1(password).toString(); // Sửa 1: Thêm .toString()
    console.log("Hashed password", hashedPassword);

    try {
        const admin = await EmployeeModel.findOne({ "User_Code": username });

        if (admin) {
            if (admin.password !== hashedPassword) {
                return res.status(401).json({ message: 'Sai mật khẩu!' });
            }

            // Tạo JWT token cho nhân viên
            const payload = {
                id: admin._id,
                username: admin.User_Code,
                role: admin.User_Code,
                // Thêm các thông tin cần thiết khác vào payload
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Sửa 2: Tạo token

            // Trả về token và thông tin user
            }
            const payload = {
                User_Code: admin["User_Code"],
                IsManager: admin['Senior Management'],
                Name: admin['First Name']

            };
            console.log('Senior Management:', admin['Senior Management']);

            console.log('Payload:', payload);
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                message: 'Đăng nhập thành công!',
                user: {
                    id: admin._id,
                    username: admin.User_Code,
                    name: admin["First Name"],
                },
                token: token, // Sửa 3: Trả về token
            });
                                message: 'Đăng nhập thành công!',
                                manager: admin['Senior Management'],
                                token : token
                            });
        }

        return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

module.exports = router;