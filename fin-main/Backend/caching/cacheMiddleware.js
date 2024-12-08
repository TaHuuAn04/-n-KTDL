const redis = require('ioredis');
const redisClient = new redis();  // Kết nối Redis

// Middleware kiểm tra cache
const checkCache = (keyPrefix) => {
    return async (req, res, next) => {
        const { page, limit, id } = req.query;

        // Tạo khóa cache duy nhất cho API này (ví dụ: page, limit cho danh sách sản phẩm)
        let cacheKey = keyPrefix;

        if (page && limit) {
            cacheKey += `:${page}:${limit}`;
        }

        if (id) {
            cacheKey += `:${id}`; // Nếu có ID thì tạo khóa riêng cho mỗi sản phẩm
        }

        try {
            // Kiểm tra cache Redis với async/await
            const data = await redisClient.get(cacheKey);
            
            if (data) {
                console.log('Cache hit');
                return res.json(JSON.parse(data)); // Trả về dữ liệu từ cache
            }

            next(); // Nếu không có cache, tiếp tục với MongoDB
        } catch (err) {
            // Xử lý lỗi Redis (ví dụ: Redis không phản hồi)
            console.error('Redis error:', err);
            return next(); // Tiếp tục gọi middleware tiếp theo
        }
    };
};

module.exports = checkCache;
