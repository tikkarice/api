const  userModel  = require('../model/user');

const createUser = async(req, res) => {
    if (req.body.fname && req.body.lname && req.body.password && req.body.confirmPassword && req.body.email) {
        // check if user already exists or not
        if (req.body.password !== req.body.confirmPassword) {
            res.json({errorCode:1, msg: "password and confirm password should be same"});
        }
        const response = await userModel.addNewUserModel(req.body);
        res.json(response);
    }
};

const login = async(req,res) => {
    if (req.body.email && req.body.password) {
        const response = await userModel.login(req.body);
        let resObj = {};
        if (response.errorCode === 0) {
            resObj.token = response.token;
            resObj.errorCode = 0;
            resObj.message = '';
        } else {
            resObj = { ...response };
        }
        res.header('auth-token',JSON.stringify(response)).send(resObj);
        // res.header('set-cookie', `tokenid=${response}`)
    } else {
        res.json({errorCode:1, message:'Please provide email and password'});
    }

}

const createDevice = async(req,res) => {
    if (req.body.name && req.body.devType) {
        const response = await userModel.createDevice(req.body, req.user);
        res.json(response);
    } else {
        return res.status(400).send({errorCode:1, message:'Please provide name, devType'});
    }
}

const editDevice = async(req,res) => {
    if (req.params.deviceId) {
        const device_id = req.params.deviceId;
        console.log("device id", device_id);
        const response = await userModel.editDevice(req.body, req.user, device_id);
        res.json(response);
    } else {
       return res.status(400).send({errorCode:1, message:'Please provide device_id'}) 
    }
}

const getDevices = async(req, res) => {
    if (req.query.userId) {
        const response = await userModel.getDevices(req.query.userId, req.user);
        res.json(response);
    } else {
         return res.status(400).send({errorCode:1, message:'Please provide userId'})
    }
}

const deleteDevice = async(req, res) => {
    if (req.params.deviceId) {
        const device_id = req.params.deviceId;
        console.log("delete", device_id);
        const response = await userModel.deleteDevice(req.user, device_id);
        res.json(response);
    } else {
       return res.status(400).send({errorCode:1, message:'Please provide device_id'}) 
    }
}

const changeState = async (req, res) => {
    if (req.params.deviceId) {
        const device_id = req.params.deviceId;
        console.log("device id", device_id);
        const response = await userModel.changeState(req.body.currentState, req.user, device_id);
        res.json(response);
    } else {
       res.json({errorCode:1, message:'Please provide device_id'}) 
    }
}

const shareDevice = async (req, res) => {
    if (req.body.deviceId && req.body.email && req.body.devType && req.body.name) {
        const response = await userModel.shareDevice(req.body, req.user);
        res.json(response);
    } else {
        res.json({errorCode:1, message:'Please provide device_id and user email to whom it is to shared'}) 
    }
}

module.exports = {
    createUser,
    login,
    createDevice,
    editDevice,
    getDevices,
    deleteDevice,
    changeState,
    shareDevice
}