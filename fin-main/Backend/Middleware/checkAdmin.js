const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const checkAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ message: 'Token không được cung cấp!' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Token không hợp lệ!' });
        }

        // Xác minh và giải mã token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Lỗi xác minh token:', err.message);
                return res.status(403).json({ message: 'Token không hợp lệ!' });
            }

            req.user = decoded; // Lưu thông tin người dùng vào req.user

            // Kiểm tra role: admin
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập (không phải admin)!' });
            }

            next(); // Cho phép request tiếp tục
        });
    } catch (error) {
        console.error('Lỗi trong middleware:', error.message);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình kiểm tra quyền!' });
    }
};

module.exports = checkAdmin;