# node-express-mongo-rabbitmq-microservices


You can access application on http://localhost:8080


Method | URL | description | access
-------|---- | ------------|--------
POST      |/users                            | create user                       | all
POST      |/signin                            | signin                       | all
GET      |/users                            | get all users                       | all
GET    |/users/{id}                          | get user by id                  | user
PATCH     |/users/{id}                          | update user                  | user 



GET       |/articles                            | get all articles             | all
GET       |/articles/{id}                       | get article with comments    | all
POST      |/articles                            | create new article           | user
PATCH     |/articles/{id}                       | update article               | user
DELETE    |/articles/{id}                       | delete article               | admin or user
POST      |/articles/{articleId}/comments       | create new comment           | user
DELETE    |/articles/{articleId}/comments/{id}  | delete comment               | admin or user
POST      |/users                               | create new user              | all
POST      |/admins                              | create new admin             | admin
PATCH     |/admins/{id}                         | update admin                 | admin 
DELETE    |/admins/{id}                         | delete admin                 | admin


