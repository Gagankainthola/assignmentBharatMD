require('dotenv').config();

const { createClient } = require('redis');

const cacheDB = createClient({
  username: 'default',
  password: process.env.REDIS_SECRET,
  socket: {
    host: 'redis-54321.c200.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 54321,
  },
});

cacheDB.on('connectionError', (err) => {
  console.log('Cache DB Error:', err);
});

const fetchFromCache = async (req, res, proceed) => {
  const key = req.originalUrl;
  const data = await cacheDB.get(key);

  if (data) {
    return res.send(JSON.parse(data));
  }

  proceed();
};

module.exports = { fetchFromCache, cacheDB };