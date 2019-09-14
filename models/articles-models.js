const connection = require("../db/connection");
const { checkTopicExists } = require("../models/topics-models");
const { selectUserByUsername } = require("../models/users-models");

exports.selectArticles = (
  article_id,
  sort_by,
  order,
  author,
  topic,
  limit,
  page
) => {
  if (
    (order && !/(de|a)sc/.test(order)) ||
    (limit && (limit < 0 || isNaN(+limit))) ||
    (page && (page < 0 || isNaN(+page)))
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("articles")
      .select(
        "articles.author",
        "articles.title",
        "articles.article_id",
        "articles.topic",
        "articles.created_at",
        "articles.votes"
      )
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by || "created_at", order || "desc")
      .limit(limit || 10)
      .offset((page - 1) * (limit || 10) || 0)
      .modify(query => {
        if (article_id) {
          query.where({ "articles.article_id": article_id }).first();
          query.select("articles.body");
        }
        if (author) {
          query.where({ "articles.author": author });
        }
        if (topic) {
          query.where({ "articles.topic": topic });
        }
      })
      .then(articles => {
        if (topic) {
          return Promise.all([articles, checkTopicExists(topic)]).then(
            ([articles]) => {
              return articles;
            }
          );
        }
        if (author) {
          return Promise.all([articles, selectUserByUsername(author)]).then(
            ([articles]) => {
              return articles;
            }
          );
        }
        if (article_id) {
          return Promise.all([
            articles,
            this.checkArticleExists(article_id)
          ]).then(([articles]) => {
            return articles;
          });
        } else {
          return articles;
        }
      });
  }
};

exports.getTotalCount = (author, topic) => {
  return connection("articles")
    .count("articles.article_id as total_count")
    .modify(query => {
      if (author) {
        query.where({ "articles.author": author });
      }
      if (topic) {
        query.where({ "articles.topic": topic });
      }
    })
    .then(count => {
      return count;
    });
};

exports.checkArticleExists = article_id => {
  return connection("articles")
    .first("*")
    .where({ article_id: article_id })
    .then(articles => {
      if (!articles) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return Promise.resolve();
      }
    });
};

exports.updateArticleByArticleId = (incrementer, article_id) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", incrementer || 0)
    .returning("*")
    .then(([updatedArticle]) => {
      if (!updatedArticle) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return updatedArticle;
      }
    });
};

exports.insertArticle = (title, body, topic, author, votes) => {
  const newArticle = { title, body, topic, author, votes };
  if (
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string" ||
    typeof author !== "string" ||
    (votes && typeof votes !== "number")
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return connection("articles")
    .insert(newArticle)
    .returning("*")
    .then(([addedArticle]) => {
      return addedArticle;
    });
};
