# node-express-mongo-rabbitmq-microservices


You can access application on http://localhost:8080


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


Api gateway accepts all requests. 
With users microservice api geteway communicates through http(using node's request module).
With posts microservice api gateway communicates with rabbitmq. There is unique uuid for each message. 
When api gateway receives message from posts microservice, event with name uuid is fired, so response can be sent to user.

Caching is added to api gateway. #TODO add when update is finished
Implemented proper error handling.
Implemented rate limiter - can't make more than 5 requests for less than 10 seconds.



