const jwt = require('jsonwebtoken');

const INVALID_TOKEN = "Access Denied;"

module.exports = function(req, res, next) {
    const token = req.header('authorization');
    if(!token) return res.status(401).send(INVALID_TOKEN);

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (e) {
        res.status(401).send(INVALID_TOKEN);
    }
}