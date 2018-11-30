

//==============================================================================

//-- Dependencies --------------------------------
const axios        = require('axios'       );
const bcryptjs     = require('bcryptjs'    );
const jsonWebToken = require('jsonwebtoken');
const {authenticate} = require('./middlewares'          );
const knexDB         = require('../database/dbConfig.js');
const jwtKey         = require('../_secrets/keys').jwtKey;

//-- Export Server Configuration Utility ---------
module.exports = server => {
    server.post('/api/register',               register);
    server.post('/api/login'   ,               login   );
    server.get ('/api/jokes'   , authenticate, getJokes);
};


//== Utility Functions =========================================================

function prepUsername(rawUsername) {
    return rawUsername;//.toLowercase();
}
function prepPassword(rawPassword) {
    return bcryptjs.hashSync(rawPassword, 4);
}
function logInUser(user) {
    // Compile User data
    const tokenData = {
        id      : user.id      ,
        username: user.username,
    };
    const secret = jwtKey;
    const options = {
        expiresIn: '1m',
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
        const priorUser = await knexDB('users')
        .select('id')
        .where({
            'username': username,
        })
        .first();
        if(priorUser){
            throw new Error('User already exists');
        }
        // Insert new user
        const [userId] = await knexDB('users').insert({
            'username': username,
            'password': password,
        });
        // Create Token
        const user = {
            'id'      : userId  ,
            'username': username,
        };
        const logInToken = logInUser(user);
        response.status(201).json(logInToken);
    }
    catch(error) {
        response.status(401).json({
            'error': error.message,
        });
    }
}

//-- Login Returning User ------------------------
async function login(request, response) {
    // implement user login
    try {
        // Validate user
        const username = prepUsername(request.body.username);
        const rawPassword = request.body.password;
        const user = await knexDB('users').where({'username': username}).first();
        if(!user || !bcryptjs.compareSync(rawPassword, user['password'])) {
            throw new Error('Credentials invalid: either username or password are incorrect');
        }
        // Create Token
        const logInToken = logInUser(user);
        response.status(200).json(logInToken);
    }
    catch(error) {
        response.status(401).json({
            'error': error.message,
        });
    }
}

//-- Get Jokes -----------------------------------
async function getJokes(request, response) {
    try {
        const result = await axios.get(
            'https://safe-falls-22549.herokuapp.com/random_ten',
            //'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
        );
        response.status(200).json(result.data);
    }
    catch(error) {
        response.status(500).json({
            message: 'Error Fetching Jokes',
            error  : error,
        });
    }
}
