
exports.up = knex => knex.schema.createTable("Movie_Notes", table => {
    
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("score of the movie").checkIn([1, 2, 3, 4, 5]); // restrição de check
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("Movie_Notes") 

