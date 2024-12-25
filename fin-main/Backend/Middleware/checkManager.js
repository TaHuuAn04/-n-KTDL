const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const checkSeniorManagement = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Payload token:', authHeader);
        if (!authHeader) {
            return res.status(403).json({ message: 'Token không được cung cấp!' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Token không hợp lệ!' });
        }
        

        // Giải mã token trước khi xác minh
        const decoded = jwt.decode(token);
        console.log('Payload token:', decoded);
        if (!decoded) {
            return res.status(403).json({ message: 'Token không hợp lệ (giải mã thất bại)!' });
        }

        // Xác minh token
        jwt.verify(token, JWT_SECRET, (err, verified) => {
            if (err) {
                console.error('Lỗi xác minh token:', err.message);
                return res.status(403).json({ message: 'Token không hợp lệ!' });
            }
            req.user = verified;
            next();
        });
    } catch (error) {
        console.error('Lỗi trong middleware:', error.message);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình kiểm tra quyền!' });
    }
};

module.exports = checkSeniorManagement;
