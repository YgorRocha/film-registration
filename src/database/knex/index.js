const config = require("../../../knexfile");

const knex = require("knex");

const connection = knex.connect(config,development);

module.exports = connection;