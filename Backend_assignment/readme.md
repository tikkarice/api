# Rest Api With JWT

REST API to perform CRUD operation using JWT

## Installation

Use [NPM] to install the dependencies

```bash
npm install
```

## EndPoints List

#### Create User
```
Path: http://localhost:3030/signup
Method: POST
Params: { "fname": "sam", "lname": "desuza", "password": "*****", "confirmPassword": "***", "email": "****" }
```
* Checks if password and confirmPassword are equal or not if not then returning error message.
* Checks if user already exists or not by finding the user with the given email if exists then sending 
  message user already exists.
* If user not exists then creating the user keeping unique id of the user (used npm uniqid)
  keeping hash of the password (using npm bcrypt).

#### Login User
```
Path: http://localhost:3030/login
Method: POST
Params: { "password": "****", "email": "***" }
```
* Checks if email exists or not if not then returning error message.
* If email exists then checking for password matching by decrypting it using bycrpt compare.
* If email and password matches then creating jwt by using user_id and secret key(inside .env).
* Setting authentication token (auth-token) on successful login.

#### Create Devies
```
Path: http://localhost:3030/device/create
Method: POST
Params: { "name": "mobile", "devType": "AAA", "currentState": 0 }
Header auth-token: JWT token provided after login
```

#### Edit Devices
```
Path: http://localhost:3030/device/edit/8mwn3kske6mtk2o
Method: PUT
Params: { "name": "Nokia 20k", "devType": "AA", "currentState":1, "device_id":"8mwn3kske6mtk2o" }
Header auth-token: JWT token provided after login
```
* Using req.user, set by verification middleware, if user gets verified
* Finding user by the user_id, given in req.user and updating the given deviceId

#### Read Devices
```
Path: http://localhost:3030/device/read?userId=8mwn3o4ke6l0hzm
Method: GET
Query Params: userId
Header auth-token: JWT token provided after login
```

#### Delete Devices
```
Path: http://localhost:3030/device/delete/8mwn6pkke6sx5ol
Method: DELETE
Route Params: deviceId
Params: { "currentState": 0 }
Header auth-token: JWT token provided after login
```
* Changes the device status from 1 to 0.

#### Share Devices
```
Path: http://localhost:3030/device/share
Method: POST
Params: { "name": "intex Speaker", "devType": "AA", "currentState": 0, "email":"****", "deviceId": "8mwn6pkke6szitm" }
Header auth-token: JWT token provided after login
```
* Email params denotes that User email to whome this device will be shared.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)