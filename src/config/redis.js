const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

module.exports = redisClient;