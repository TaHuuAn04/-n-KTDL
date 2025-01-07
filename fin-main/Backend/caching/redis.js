// redis.js
const Redis = require('ioredis');
const redisClient = new Redis({
  host: '127.0.0.1', // Địa chỉ Redis server (localhost)
  port: 6379,        // Cổng Redis server
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully!');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redisClient;  // Export redisClient