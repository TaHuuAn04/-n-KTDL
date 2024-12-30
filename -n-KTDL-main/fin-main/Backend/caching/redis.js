// redis.js
const redis = require('ioredis');
const redisClient = new redis();

redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redisClient;  // Export redisClient