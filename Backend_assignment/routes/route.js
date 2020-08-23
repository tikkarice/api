const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');

const userController = require('../controller/userController');

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.post('/device/create', verify, userController.createDevice);
router.put('/device/edit/:deviceId', verify, userController.editDevice);
router.get('/device/read', verify, userController.getDevices);
router.delete('/device/delete/:deviceId', verify, userController.deleteDevice);
router.put('/device/currentState/:deviceId', verify, userController.changeState);
router.post('/device/share', verify, userController.shareDevice);

module.exports = router;