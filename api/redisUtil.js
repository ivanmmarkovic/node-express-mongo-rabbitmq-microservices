const Redis = require('ioredis');
const cacheEx = 60 * 60 * 24;

let redisClient;

function getClient(){
    if(!redisClient) {
        redisClient = new Redis({
            host: 'redis',
            port: 6379
        });
    }

    return redisClient;
}


module.exports = {
    getClient,
    cacheEx
};
