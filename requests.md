
### POST /auth/signup

```sh
curl -X POST http://localhost:3000/auth/signup \
-H "Content-Type: application/json" \
-d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
}'
```

### POST /auth/login

```sh
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "newuser@example.com",
    "password": "password123"
}'
```

### POST /posts/new

```sh
curl -X POST http://localhost:3000/posts/new \
-H "Content-Type: application/json" \
-H "x-auth-token: YOUR_JWT_TOKEN" \
-d '{
    "title": "New Post",
    "description": "This is a new post",
    "author": "USER_ID"
}'
```
