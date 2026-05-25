const { createClient } = require('redis');

let redisClient = null;
let isConnected = false;
let errorLogged  = false; // only log once

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          // Stop retrying after 3 attempts — Redis is not running locally
          if (retries >= 3) {
            if (!errorLogged) {
              console.warn('⚠️  Redis not available — caching disabled (app works fine without it)');
              errorLogged = true;
            }
            return false; // stop retrying
          }
          return Math.min(retries * 500, 2000); // wait before retry
        },
      },
    });

    // Suppress per-event error spam — reconnectStrategy handles it
    redisClient.on('error', () => {
      isConnected = false;
    });

    redisClient.on('connect',    () => { isConnected = true; });
    redisClient.on('disconnect', () => { isConnected = false; });

    await redisClient.connect();
    isConnected = true;
    console.log(' Redis connected');
  } catch (err) {
    if (!errorLogged) {
      console.warn('⚠️  Redis not available — caching disabled (app works fine without it)');
      errorLogged = true;
    }
    isConnected = false;
  }
};

const getCache = async (key) => {
  if (!isConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

const setCache = async (key, value, ttlSeconds = 3600) => {
  if (!isConnected) return;
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch { /* silent */ }
};

const delCache = async (key) => {
  if (!isConnected) return;
  try { await redisClient.del(key); } catch { /* silent */ }
};

connectRedis();

module.exports = { getCache, setCache, delCache };