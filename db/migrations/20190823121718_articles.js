exports.up = function(knex) {
  console.log("creating articles table");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable
      .string("topic")
      .notNullable()
      .references("topics.slug");
    articlesTable
      .string("author")
      .notNullable()
      .references("users.username");
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  console.log("removing articles table");
  return knex.schema.dropTable("articles");
  I;
};
