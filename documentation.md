# CELER API Documentation

## Usermanagement

### Register

To register a new user you can send a POST request to `/register` with the following body:

```json
{
    "username": "username",
    "password": "password",
    "passwordRepeat": "password"
}
```

Note that both a passowrd and the same password repeated are required. If the passwords do not match, the server will respond with a 400 Bad Request and the following body:

```json
{
    "error": "Passwords do not match"
}
```

If the passwords don't match the regex specified in the `config.json` file, the server will also respond with a 400 Bad Request and the following body:

```json
{
    "error": "Password isn't secure enough",
    "message": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
}
```

If the username is already taken, the server will respond with a 400 Bad Request and the following body:

```json
{
    "error": "'User already exists'"
}
```

If it succeeds, the server will respond with a 200 OK and the following body:

```json
{
    "message": "User added successfully"
}
```

### Login

To Login you can send a POST request to `/login` with the following body:

```json
{
    "username": "username",
    "password": "password"
}
```

If the username or password is incorrect, the server will respond with a 401 Unauthorized and the following body:

```json
{
    "error": "Wrong credentials"
}
```

If the combination is correct, the server will respond with a 200 OK  and the following body:

```json
{
    "message": "You are logged in"
}
```

It will create a session cookie that expires after 24 hours.

### Logout

To logout you can send a POST request to `/logout`. It will delete the session cookie and respond with a 200 OK and the following body:

```json
{
    "message": "You are logged out"
}
```	
