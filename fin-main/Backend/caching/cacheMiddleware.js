const redis = require('ioredis');
const redisClient = new redis();  
// Middleware kiểm tra cache
const checkCache = (keyPrefix) => {
    return async (req, res, next) => {
        const { page, limit, id } = req.query;
        let cacheKey = keyPrefix;
        if (page && limit) {
            cacheKey += `:${page}:${limit}`;
        }
        if (id) {
            cacheKey += `:${id}`;
        }
        try {
            const data = await redisClient.get(cacheKey);
            if (data) {
                console.log('Cache hit');
                return res.json(JSON.parse(data)); // Trả về dữ liệu từ cache
            }
            next(); // Nếu không có cache, tiếp tục với MongoDB
        } catch (err) {
            console.error('Redis error:', err);
            return next(); 
        }
    };
};

module.exports = checkCache;
