

//==============================================================================

//-- Dependencies --------------------------------
const config = require('../../config.js');

//------------------------------------------------
exports.up = function(knex) {
    return knex.schema.createTable(config.TABLE_USERS, users => {
        users.increments();
        users
            .string(config.FIELD_USERNAME, config.LIMIT_USERNAME)
            .notNullable()
            .unique();
        users
            .string(config.FIELD_PASSWORD, config.LIMIT_PASSWORD)
            .notNullable();
    });
};
exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(config.TABLE_USERS);
};
