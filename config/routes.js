

let shuffleTroll = (function () {
    function trollCompare() {
        return Math.random() - 1/2;
    }
    return function(originalArray) {
        let shuffledArray = originalArray.slice();
        shuffledArray.sort(trollCompare);
        return shuffledArray;
    }
}());




//==============================================================================

//-- Dependencies --------------------------------
const axios        = require('axios'       );
const bcryptjs     = require('bcryptjs'    );
const jsonWebToken = require('jsonwebtoken');
const config         = require('../config.js'           );
const {authenticate} = require('./middlewares'          );
const knexDB         = require('../database/dbConfig.js');
const jwtKey         = require('../_secrets/keys').jwtKey;

//-- Export Server Configuration Utility ---------
module.exports = server => {
    server.post(config.URL_REGISTER,               register);
    server.post(config.URL_LOGIN   ,               login   );
    server.get (config.URL_JOKES   , authenticate, getJokes);
};


//== Utility Functions =========================================================

function prepUsername(rawUsername) {
    return rawUsername;//.toLowercase();
}
function prepPassword(rawPassword) {
    return bcryptjs.hashSync(rawPassword, config.HASHDEPTH_PASSWORD);
}
function logInUser(user) {
    // Compile User data
    const tokenData = {
        id      : user.id      ,
        username: user.username,
    };
    const secret = jwtKey;
    const options = {
        expiresIn: config.TIME_TOKENLIFE,
    };
    return jsonWebToken.sign(tokenData, secret, options);
}


//== Route Handlers ============================================================

//-- Register New User ---------------------------
async function register(request, response) {
    // implement user registration
    try {
        const username = prepUsername(request.body.username);
        const password = prepPassword(request.body.password);
        // Check for previous user with same name
        const priorUser = await knexDB(config.TABLE_USERS)
        .select(config.FIELD_ID)
        .where({
            [config.FIELD_USERNAME]: username,
        })
        .first();
        if(priorUser){
            throw new Error(config.ERROR_LOGINCONFLICT);
        }
        // Insert new user
        const [userId] = await knexDB(config.TABLE_USERS).insert({
            [config.FIELD_USERNAME]: username,
            [config.FIELD_PASSWORD]: password,
        });
        // Create Token
        const user = {
            [config.FIELD_ID      ]: userId  ,
            [config.FIELD_USERNAME]: username,
        };
        const logInToken = logInUser(user);
        response.status(201).json(logInToken);
    }
    catch(error) {
        response.status(401).json({
            error: error.message,
        });
    }
}

//-- Login Returning User ------------------------
async function login(request, response) {
    console.log('hit')
    // implement user login
    try {
        // Validate user
        const username = prepUsername(request.body.username);
        const rawPassword = request.body.password;
        const user = await knexDB(config.TABLE_USERS)
            .where({
                [config.FIELD_USERNAME]: username,
            })
            .first();
        const storedPassword = (!user)? null : user[config.FIELD_PASSWORD];
        if(!user || !bcryptjs.compareSync(rawPassword, storedPassword)) {
            throw new Error(config.ERROR_LOGINFAILURE);
        }
        // Create Token
        const logInToken = logInUser(user);
        response.status(200).json(logInToken);
    }
    catch(error) {
        response.status(401).json({
            error: error.message,
        });
    }
}

//-- Get Jokes -----------------------------------
async function getJokes(request, response) {
    try {
        const result = await axios.get(config.URL_API_JOKES);
        response.status(200).json(result.data);
    }
    catch(error) {
        response.status(500).json({
            message: config.ERROR_FETCHFAILURE,
            error  : error,
        });
    }
}
