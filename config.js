

//== Project Constants =========================================================

module.exports = {
    // URLs
    URL_REGISTER: '/api/register',
    URL_LOGIN   : '/api/login'   ,
    URL_JOKES   : '/api/jokes'   ,
    URL_API_JOKES    : 'https://safe-falls-22549.herokuapp.com/random_ten',
    URL_API_JOKES_OLD: 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten',
    // Database
    TABLE_USERS: 'users',
    FIELD_ID      : 'id'      ,
    FIELD_USERNAME: 'username',
    FIELD_PASSWORD: 'password',
    LIMIT_USERNAME: 128,
    LIMIT_PASSWORD: 128,
    // Errors
    ERROR_LOGINFAILURE : 'Credentials invalid: either username or password are incorrect',
    ERROR_LOGINCONFLICT: 'User already exists',
    ERROR_FETCHFAILURE : 'Error Fetching Jokes',
    ERROR_NOCREDENTIALS: 'No token provided, must be set on the Authorization Header',
    // Time
    TIME_TOKENLIFE: '2m',
    // Misc
    HASHDEPTH_PASSWORD: 10,
    HEADER_AUTHORIZATION: 'Authorization',
};
