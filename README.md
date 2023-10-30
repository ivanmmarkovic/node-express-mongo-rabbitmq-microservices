# node-express-mongo-rabbitmq-redis-microservices

Microservices application in Node.js/Express.js

- API gateway service handle all requests and authentication.
- Synchronous communication with HTTP protocol.
- Asynchronous communication with RabbitMQ.
- JWT authentication
- Redis for caching
- Rate limiter

You can access application on http://localhost:8080.
To test all routes, there is a Postman collection.
To start application, navigate to root directory and run docker-compose up --build.


Method | URL | description | access
-------|---- | ------------|--------
POST      |/signin                           | signin                 | all
POST      |/users                            | create user            | all
GET       |/users                            | get all users          | all
GET       |/users/{id}                       | get user by id         | all
PATCH     |/users/{id}                       | update user            | user can update own profile
DELETE    |/users/{id}                       | delete user            | user can delete own profile
POST      |/posts                            | create new article     | user
GET       |/posts                            | get all posts          | all
GET       |/posts/{id}                       | get post by id         | all
DELETE    |/posts/{id}                       | delete post            | user can delete own post


API gateway accepts all requests. API gateway can authenticate and authorize client requests. JSON Web Token (JWT) is used for authentication.

### API gateway - users microservice
With users microservice, API geteway communicates through http(using nodes's request module).
Calls to users microservice with request module, are warapped in promises. Response data from users microservice contains `responseData` and `errorMessage` fields. Response status is same as response status from user microservice. If `errorMessage` is not null, response to client contains only `error` field, which contains `errorMessage`.
```javascript
{
    "error": "Duplicate key name"
}
```
If everything is ok, responseData is send to client. 

### API gateway - posts microservice
With posts microservice API gateway communicates with rabbitmq. There is unique uuid for each message. 
When API gateway receives message from posts microservice, event with name uuid is fired, so response can be sent to client.

```javascript
// Code snippet from route in API gateway service
let action = 'GET_POST_BY_ID';
// send action, payload(in this case is post's id) and uuid.
channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: {id}, uuid})));

// When message from posts microservice is received, event with same uuid will be fired 
e.on(uuid, (status, message, payload) => {
    if(message != 'Ok'){
        return res.status(status).json({error: message});
    }
    redisClient.set(id, JSON.stringify(payload.post), 'EX', cacheEx);
    return res.status(status).json(payload.post);
});
```
Sending data from posts microservice to API gateway
```javascript
// Code snippet from posts microservice
channel.sendToQueue(postsToApiQueue, Buffer.from(
    JSON.stringify({status, message, payload, uuid})
));
```

When message from posts microservice is received, event with same uuid will be fired, and arguments will be `status, message and payload`.
```javascript
// Code snippet from users microservice
apiToPostsChannel.consume(postsToApiQueue, data => {
    apiToPostsChannel.ack(data);
    let {uuid, status, message, payload} = JSON.parse(data.content.toString());
    e.emit(uuid, status, message, payload);
});
```

Caching is added to api gateway. 

Implemented proper error handling.

Implemented rate limiter - clients can't make more than 5 requests for less than 10 seconds.



### Todo
- Add logger
- Add admin
- Add separate (SQL)database for users microservice
- Minio for files
- Move jwt key in .env file
- Add comments microservice



