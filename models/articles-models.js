const connection = require("../db/connection");

exports.selectArticles = (article_id, sort_by, order, author, topic) => {
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
    .orderBy(sort_by || "created_at", order || "asc")
    .modify(query => {
      if (article_id) {
        query.where({ "articles.article_id": article_id }).first();
        query.select("articles.body");
      }
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ "articles.topic": topic });
    })
    .then(articles => {
      if (!articles) {
        return Promise.reject({ status: 404, msg: "Page not Found" });
      } else if (articles.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      } else {
        return articles;
      }
    });
};

exports.updateArticleByArticleId = (incrementer, article_id) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", incrementer)
    .returning("*")
    .then(([updatedArticle]) => {
      if (!updatedArticle) {
        return Promise.reject({ status: 404, msg: "Page not Found" });
      } else {
        return this.selectArticles(updatedArticle.article_id);
      }
    });
};

exports.insertCommentByArticleId = (author, body, article_id) => {
  const newComment = { author, body, article_id };
  return connection("comments")
    .insert(newComment)
    .returning("*")
    .then(([addedComment]) => {
      return addedComment;
    });
};

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  return connection("comments")
    .select("comment_id", "author", "votes", "created_at", "body")
    .where(article_id)
    .orderBy(sort_by || "created_at", order || "asc")
    .then(comments => {
      if (!comments.length) {
        return Promise.reject({ status: 404, msg: "Page not Found" });
      } else {
        return comments;
      }
    });
};
