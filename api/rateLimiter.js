


let ips = {};


async function limiter(req, res, next){
    let now = new Date().getTime();
    if(req.ip in ips){
        let {start, requests} = ips[req.ip];
        console.log(now - start, requests);
        if((now - start)/1000 < 10){
            if(requests >= 3){
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

module.exports = limiter;