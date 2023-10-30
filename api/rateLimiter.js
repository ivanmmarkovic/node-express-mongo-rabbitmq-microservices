
const {getClient, cacheEx} = require('./redisUtil');
/*
let ips = {};


async function limiter(req, res, next){
    let now = new Date().getTime();
    if(req.ip in ips){
        let {start, requests} = ips[req.ip];
        console.log(now - start, requests);
        if((now - start)/1000 < 10){
            if(requests >= 5){
                return res.status(400).json({error: 'Too many requests'});
            }
            else {
                ips[req.ip].requests = requests + 1;
            }
        }
        else {
            ips[req.ip] = {
                start: now,
                requests: 1
            };
        }
    }
    else {
        ips[req.ip] = {
            start: now,
            requests: 1
        }
    }
    next();
}
*/

async function limiter(req, res, next){

    let now = new Date().getTime();
    let redisClient = getClient();
    let clientCached = await redisClient.get(req.ip);
    
    if(clientCached){
        let {start, requests} = JSON.parse(clientCached); 
        if((now - start)/1000 <= 10){
            if(requests >= 5){
                return res.status(400).json({error: 'Too many requests'});
            }
            else {
                await redisClient.set(req.ip, JSON.stringify({start, requests: requests + 1}), 'EX', cacheEx);
            }
        }
        else {
            await redisClient.set(req.ip, JSON.stringify({start: now, requests: 1}), 'EX', cacheEx);
        }
    }
    else {
        await redisClient.set(req.ip, JSON.stringify({start: now, requests: 1}), 'EX', cacheEx);
    }

    next();
}

module.exports = limiter;