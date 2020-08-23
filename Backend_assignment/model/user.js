const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbConnection = require("../util/dbConnection");

const checkIfUserExist = async (email) => {
    const db = dbConnection.getConnectionInstance();
    const userData = await db.collection('user-credentials').findOne({email});
    return userData ? true  : false;
};

const addNewUserModel = async (_params) =>{
    const responseObject = { errorCode: 0, msg: '' };

    // checking if the user is already there in the database
    if (await checkIfUserExist(_params.email)) {
        responseObject.errorCode = 1;
        responseObject.msg = `User already exist for ${_params.email} ID.`;
    }
    if (responseObject.errorCode === 0) {
            const db = dbConnection.getConnectionInstance();

            // Hash Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(_params.password, salt);
            const addUserObj = {
                fname: _params.fname,
                lname: _params.lname,
                password: hashedPassword,
                email: _params.email,
                user_id: uniqid()
            }
            const addUserQry = await db.collection('user-credentials').insertOne(addUserObj);
            responseObject.errorCode = addUserQry.result.ok === 1 ? 0: 1;
            responseObject.msg = addUserQry.result.ok === 1 ? `User created with ID ${_params.email}.` : 'Some thing went wrong 502';
    }
    return responseObject;

};

const login = async (_params) => {
    // checking if the email exists
    const user = await db.collection('user-credentials').findOne({email:_params.email});
    if (!user) return {errorCode:1, message:'Email is not found'};
    // PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(_params.password, user.password);
    if (!validPass) return {errorCode:1, message: 'Invalid password'};

    // Create and assign a token
    console.log(validPass);
    const token = jwt.sign({_id: user.user_id},process.env.TOKEN_SECRET);
    return {token:token, errorCode:0, message: ""};

}

const createDevice = async (_params, user) =>{
    console.log("user=====>", user._id);
    if (_params.devType === "AA" || "AB" || "AC" || "BA" || "BB" || "BC") {
        const deviceObj = {
            device_id: uniqid(),
            name: String(_params.name),
            devType: _params.devType,
            currentState: _params.currentState,
            lastUpdated: new Date().getTime()
        };
        const dbUser = await db.collection('user-credentials').findOne({user_id:user._id});
        if (user) {
            const dbUser = await db.collection('user-credentials').findOne({user_id:user._id});
            const devices = [];
            if (dbUser.devices && dbUser.devices.length > 0) {
                for (let i = 0; i < dbUser.devices.length; i++) {
                    if (dbUser.devices[i].device_id !== deviceObj.device_id) {
                        devices.push(dbUser.devices[i]);
                    }
                }
                devices.push(deviceObj);
                //console.log("dedvices====>",devices);
            } else if (!dbUser.devices || (dbUser.devices && dbUser.devices.length === 0)) {
                devices.push(deviceObj);
            }
            await db.collection('user-credentials').updateOne({user_id:user._id}, {$set: {devices:devices}});
            return {errorCode:0, message:'device got added successfully'};
        } else {
            return {errorCode:1, message:'not a valid user'}; 
        }    
    } else {
        return {errorCode:1, message: 'device type should be among the given type'}
    }
    
}

const editDevice = async (_params, user, deviceId) => {
    if (user) {
        const dbUser = await db.collection('user-credentials').findOne({user_id:user._id});
        if (dbUser.devices) {
            const devices = [];
            for (let i = 0; i < dbUser.devices.length; i++) {
                if (dbUser.devices[i].device_id === deviceId) {
                        if (_params.devType && (_params.devType === "AA" || _params.devType === "AB" || _params.devType === "AC" || _params.devType === "BA" || _params.devType === "BC" || _params.devType === "BB" )) {
                        dbUser.devices[i].devType = _params.devType;
                    }
                    if (_params.name) {
                        dbUser.devices[i].name = _params.name;
                    }
                    dbUser.devices[i].lastUpdated = new Date().getTime();
                }
                devices.push(dbUser.devices[i]);
            }
            await db.collection('user-credentials').updateOne({user_id:user._id}, {$set: {devices:devices}});
             return {errorCode:0, message:`Device ID ${deviceId} got updated.`};
        } else {
             return {errorCode:1, message:'no device to update'};
        }
    } else {
        return {errorCode:1, message:'not a valid user'};
    }
}

const getDevices = async(userId, user) => {
    if (userId === user._id) {
        const dbUser = await db.collection('user-credentials').findOne({user_id:user._id});
        if (dbUser && dbUser.devices) {
            return {errorCode:0, devices: dbUser.devices, message:'devices fetched successfully'}
        } else {
            return {errorCode:1, devices: [], message:'no device found'};
        }
    } else {
       return {errorCode:1, message:'wrong userId passed'}; 
    }
}

const deleteDevice = async(user, deviceId) => {
     const dbUser = await db.collection('user-credentials').findOne({user_id:user._id});
     if (dbUser && dbUser.devices) {
         const devices = [];
         for (let i = 0; i < dbUser.devices.length; i++) {
             if (dbUser.devices[i].device_id !== deviceId ) {
                    devices.push(dbUser.devices[i]);
             }
         }
         await db.collection('user-credentials').updateOne({user_id:user._id}, {$set: {devices:devices}});
         return {errorCode:0, message:`Device ID ${deviceId} deleted.`};
     } else {
          return {errorCode:1, message:'no device found'};
     }
}

const changeState = async(state, user, deviceId) => {
    if (user) {
        const dbUser = await db.collection('user-credentials').findOne({user_id:user._id});
        if (dbUser.devices) {
            const devices = [];
            for (let i = 0; i < dbUser.devices.length; i++) {
                if (dbUser.devices[i].device_id === deviceId) {
                    if (state !== null) {
                        dbUser.devices[i].currentState = state;
                    }
                    dbUser.devices[i].lastUpdated = new Date().getTime();
                }
                devices.push(dbUser.devices[i]);
            }
            await db.collection('user-credentials').updateOne({user_id:user._id}, {$set: {devices:devices}});
             return {errorCode:0, message:`Device ID ${deviceId} currentState got updated.`};
        } else {
             return {errorCode:1, message:'no device to update'};
        }
    } else {
        return {errorCode:1, message:'not a valid user'};
    }
}

const shareDevice = async (_params, user) => {
    if (user) {
        const sharedUser = await db.collection('user-credentials').findOne({email: _params.email});
        if (sharedUser) {
            const devices = [];
            for (let i = 0; i < sharedUser.devices.length; i++) {
                if (sharedUser.devices[i].device_id !== _params.deviceId) {
                    devices.push(sharedUser.devices[i]);
                }
            }
            const deviceToBeAdded = {};
            deviceToBeAdded.name = _params.name;
            deviceToBeAdded.device_id = _params.deviceId;
            deviceToBeAdded.devType = _params.devType;
            if (_params.currentState !== null) {
                deviceToBeAdded.currentState = _params.currentState;
            }
            deviceToBeAdded.lastUpdated = new Date().getTime();
            devices.push(deviceToBeAdded);
            await db.collection('user-credentials').updateOne({email: _params.email}, {$set:{devices:devices}});
            return {errorCode:0, message: `Device ID ${_params.deviceId} is shared with user ${_params.email}`};
        }
    } else {
        return {errorCode:1, message: "Wrong User"};   

    }

}

module.exports = {
    addNewUserModel,
    login,
    createDevice,
    editDevice,
    getDevices,
    deleteDevice,
    changeState,
    shareDevice
}