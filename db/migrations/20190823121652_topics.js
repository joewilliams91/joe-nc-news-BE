exports.up = function(knex) {
  console.log("creating topics table");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing topics tables...");
  return knex.schema.dropTable("topics");
};
