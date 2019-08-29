exports.up = function(knex) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .notNullable()
      .references("users.username");
    commentsTable
      .integer("article_id")
      .notNullable()
      .references("articles.article_id");
    commentsTable.integer("votes").defaultsTo(0);
    commentsTable.timestamp("created_at").defaultsTo(knex.fn.now());
    commentsTable.string("body", 10000).notNullable();
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable("comments");
};
