const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';  

// Middleware để xác thực và lấy thông tin từ token
const verifyToken = (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];  // Lấy token từ header Authorization
    console.log('Token:', token);  // Log token ra để kiểm tra
    if (!token) {
        return res.status(403).json({ message: 'Không có token, truy cập bị từ chối' });
    }

    try {
        
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;  
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
module.exports = verifyToken;