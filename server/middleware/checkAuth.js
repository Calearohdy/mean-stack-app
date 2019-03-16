const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'secret_that_is_too_short');
        next();
    } catch (error) {
        res.status(401).json({
            error: error,
            message: 'Auth failed'
        })
    }
    
}