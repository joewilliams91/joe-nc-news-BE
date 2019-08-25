const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      //format of articles data, replacing the UNIX string with a timestamp to coincide with articles migration configuration
      const newArticleData = formatDates(articleData);

      const articlesInsertions = knex("articles")
        .insert(newArticleData)
        .returning("*");

      return Promise.all([articlesInsertions]);
    })
    .then(([articleRows]) => {
      //makes a lookup object from the articles table, comprising article title and article id
      const articleRef = makeRefObj(articleRows, "title", "article_id");
      //formats the comments data, replacing the relevant article title with its article id to coincide with comments migration configuration
      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
