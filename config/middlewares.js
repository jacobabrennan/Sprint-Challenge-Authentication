

//==============================================================================

//-- Dependencies --------------------------------
const jwt = require('jsonwebtoken');
const jwtKey = require('../_secrets/keys').jwtKey;
const config = require('../config.js'    );

//------------------------------------------------
// quickly see what this file exports
module.exports = {
    authenticate,
};

//-- implementation details ----------------------
function authenticate(req, res, next) {
    const token = req.get(config.HEADER_AUTHORIZATION);
    if(token) {
        jwt.verify(token, jwtKey, (err, decoded) => {
            if(err) {
                return res.status(401).json(err);
            }
            req.decoded = decoded;
            next();
        });
    }
    else {
        return res.status(401).json({
            error: config.ERROR_NOCREDENTIALS,
        });
    }
}
