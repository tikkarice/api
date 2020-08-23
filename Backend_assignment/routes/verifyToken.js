const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.send({message:'Access Denied', errorCode:1});

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("check===>",verified);
        req.user = verified;
        next();
    } catch(err) {
        res.send({message:'Invalid Token', errorCode:1});
    }
}