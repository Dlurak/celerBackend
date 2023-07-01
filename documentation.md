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
    "message": "You are logged in",
    "username": "username",
    "token": "token"
}
```
The token is a JSON Web Token that is used to authenticate the user *currently this is still work in progress*. The Token is valid for 1 hour and the content is the username of the user.


### Adding a ride Request

To add a ride Request you can send a POST request to `/rideRequest` with the following body:


```json
{
    "startLocation": [0, 2.05],
    "destinationLocation": [0, 2],
    "cargoWeight": 1,
    "cargoVolume": 1,
    "cargoDescription": "description",
    "cargoSpecialCharacteristics": ""
}
```

`cargoSpecialCharacteristics` is optional and can be left out. If you leave it out, the server will asume no special characteristics. If you want to specify special characteristics, you can use the following values:
- fragile
- flamable
- explosive
- living
- none

There will be quite a lot of validation on the server side, so if you send invalid data, you will get a 400 Bad Request with one of the following error messages:

| Error Message                             | Description                                                                  |
| -------------------------------------     | ---------------------------------------------------------------------------- |
| `requestor is blocked`                    | The user is blocked and can't add a ride request, this isn't implemented yet |
| `start and destination are too close`     | The start and destination need to have a distance of at least 100 meters     |
| `start and destination are too far apart` | The start and destination need to have a distance of at most 1000 kilometers |
| `cargo weight can't be negative`          | The cargo weight needs to be positive                                        |
| `cargo volume can't be negative`          | The cargo volume needs to be positive                                        |

When you use wrong types or do not send required fields, you will get a 400 Bad Request with one of the following error messages:

- `missing <key>`
- `<key> must be of type <type>` 
- `<key> must have two elements` can only occur for `startLocation` and `destinationLocation`
- `<key> must be an array of two numbers` can only occur for `startLocation` and `destinationLocation`
